import { BlockType, IBlock, ITaskSprint } from "../../mongo/block";
import { IUser } from "../../mongo/user";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import cast, { indexArray } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { BlockDoesNotExistError } from "../block/errors";
import { IBaseContext } from "../contexts/BaseContext";
import { IBlockContext } from "../contexts/BlockContext";
import { IOrganization } from "../organization/types";

const blocks: IBlock[] = [];

class TestBlockContext implements IBlockContext {
    getBlockById = async <T = IBlock>(ctx: IBaseContext, customId: string) => {
        const block = blocks.find((block) => block.customId === customId);
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
        const blockMap = indexArray(blocks, { path: "customId" });
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
        const index = blocks.findIndex((block) => block.customId === customId);

        if (index !== -1) {
            return null;
        }

        blocks[index] = { ...blocks[index], ...data };
        return cast<T>(blocks[index]);
    };

    saveBlock = async <T = IBlock>(
        ctx: IBaseContext,
        block: Omit<IBlock, "customId">
    ) => {
        blocks.push({
            ...block,
            customId: getNewId(),
        });

        return cast<T>(blocks[blocks.length - 1]);
    };

    deleteBlockAndChildren = async (ctx: IBaseContext, customId: string) => {
        const index = blocks.findIndex((block) => block.customId === customId);

        if (index !== -1) {
            return null;
        }

        blocks.splice(index, 1);
    };

    getBlockChildren = async <T = IBlock>(
        ctx: IBaseContext,
        customId: string,
        typeList?: BlockType[]
    ) => {
        const reuslt = blocks.filter((block) => {
            return (
                block.customId === customId &&
                (typeList ? typeList.includes(block.type) : true)
            );
        });

        return cast<T[]>(blocks);
    };

    getUserRootBlocks = async (ctx: IBaseContext, user: IUser) => {
        const organizationsMap = indexArray(user.organizations, {
            path: "customId",
        });
        return blocks.filter((block) => organizationsMap[block.customId]);
    };

    getUserOrganizations = async (ctx: IBaseContext, user: IUser) => {
        const organizationsMap = indexArray(user.organizations, {
            path: "customId",
        });
        const organizations = blocks.filter(
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
        blocks.forEach((block, index) => {
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

            blocks[index] = {
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
            blocks.findIndex((block) => {
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
