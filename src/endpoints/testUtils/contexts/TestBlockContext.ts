import { BlockType } from "aws-sdk/clients/textract";
import { IBlock, ITaskSprint } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import makeSingletonFn from "../../../utilities/createSingletonFunc";
import { cast, indexArray } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { BlockDoesNotExistError } from "../../block/errors";
import { IBlockContext } from "../../contexts/BlockContext";
import { IBaseContext } from "../../contexts/IBaseContext";
import { IOrganization } from "../../organizations/types";
import { TestMemoryContext } from "./utils";

class TestBlockContext
  extends TestMemoryContext<IBlock>
  implements IBlockContext
{
  blocks: IBlock[] = [];
  getBlockById = async <T = IBlock>(ctx: IBaseContext, customId: string) => {
    const block = this.items.find((block) => block.customId === customId);
    return cast<T>(block);
  };

  assertGetBlockById = async <T = IBlock>(
    ctx: IBaseContext,
    customId: string,
    throwError?: () => void
  ) => {
    const block = await ctx.block.getBlockById(ctx, customId);

    if (!block) {
      if (throwError) throwError();
      throw new BlockDoesNotExistError();
    }

    return cast<T>(block);
  };

  assertBlockById = async (
    ctx: IBaseContext,
    customId: string,
    throwError?: () => void
  ) => {
    const block = await ctx.block.getBlockById(ctx, customId);

    if (!block) {
      if (throwError) throwError();
      throw new BlockDoesNotExistError();
    }

    return true;
  };

  bulkGetBlocksByIds = async (ctx: IBaseContext, customIds: string[]) => {
    const blockMap = indexArray(this.items, { path: "customId" });
    const data: IBlock[] = [];
    customIds.forEach((id) => {
      if (blockMap[id]) {
        data.push(blockMap[id]);
      }
    });

    return data;
  };

  updateBlockById = async <T = IBlock>(
    ctx: IBaseContext,
    customId: string,
    data: Partial<IBlock>
  ) => {
    const index = this.items.findIndex((block) => block.customId === customId);

    if (index === -1) {
      return null;
    }

    this.items[index] = { ...this.items[index], ...data };
    return cast<T>(this.items[index]);
  };

  saveBlock = async <T = IBlock>(
    ctx: IBaseContext,
    block: Omit<IBlock, "customId">
  ) => {
    this.items.push({
      ...block,
      customId: getNewId(),
    });

    return cast<T>(this.items[this.items.length - 1]);
  };

  deleteBlockAndChildren = async (ctx: IBaseContext, customId: string) => {
    const index = this.items.findIndex((block) => block.customId === customId);

    if (index === -1) {
      return null;
    }

    this.items.splice(index, 1);

    this.items = this.items.filter((block) => {
      return block.customId !== customId && block.parent !== customId;
    });
  };

  getBlockChildren = async <T = IBlock>(
    ctx: IBaseContext,
    customId: string,
    typeList?: BlockType[]
  ) => {
    const result = this.items.filter((block) => {
      return (
        block.parent === customId &&
        (typeList ? typeList.includes(block.type) : true)
      );
    });

    return cast<T[]>(result);
  };

  getUserRootBlocks = async (ctx: IBaseContext, user: IUser) => {
    const organizationsMap = indexArray(user.orgs, {
      path: "customId",
    });
    return this.items.filter((block) => organizationsMap[block.customId]);
  };

  getUserOrganizations = async (ctx: IBaseContext, user: IUser) => {
    const organizationsMap = indexArray(user.orgs, {
      path: "customId",
    });
    const organizations = this.items.filter(
      (block) => organizationsMap[block.customId]
    );
    return cast<IOrganization[]>(organizations);
  };

  bulkUpdateTaskSprints = async (
    ctx: IBaseContext,
    sprintId: string,
    taskSprint: ITaskSprint | null,
    userId: string,
    updatedAt?: Date,
    excludeStatusIds?: string[]
  ) => {
    this.items.forEach((block, index) => {
      if (block.taskSprint?.sprintId !== sprintId) {
        return;
      }

      if (
        excludeStatusIds &&
        block.status &&
        excludeStatusIds.includes(block.status)
      ) {
        return;
      }

      this.items[index] = {
        ...block,
        taskSprint,
        updatedAt,
        updatedBy: userId,
      };
    });
  };

  blockExists = async (
    ctx: IBaseContext,
    name: string,
    type: BlockType,
    parent?: string
  ) => {
    name = name.toLowerCase();
    return (
      this.items.findIndex((block) => {
        return (
          block.name.toLowerCase() === name &&
          block.type === block.type &&
          (block.parent ? block.parent === parent : true)
        );
      }) !== -1
    );
  };

  public countBoardTasks = async (ctx: IBaseContext, boardId: string) => {
    throw new Error("not implemented yet!!");
  };

  getTasksByStatus = async () => {
    throw new Error("not implemented yet!!");
    return [];
  };
}

export const getTestBlockContext = makeSingletonFn(
  () => new TestBlockContext()
);
