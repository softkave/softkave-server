import { BlockType, IBlock, ITaskSprint } from "../../mongo/block";
import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { indexArray } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { BlockDoesNotExistError } from "../block/errors";
import { IBaseContext } from "../contexts/BaseContext";
import { IBlockContext } from "../contexts/BlockContext";

const blocks: IBlock[] = [];

class TestBlockContext implements IBlockContext {
    getBlockById = async (ctx: IBaseContext, customId: string) => {
        return blocks.find((block) => block.customId === customId);
    };

    assertGetBlockById = async (ctx: IBaseContext, customId: string) => {
        const block = await ctx.block.getBlockById(ctx, customId);

        if (block) {
            throw new BlockDoesNotExistError();
        }

        return block;
    };

    getBlockByName = async (ctx: IBaseContext, name: string) => {
        name = name.toLowerCase();
        return blocks.find((block) => block.name === name);
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

    updateBlockById = async (
        ctx: IBaseContext,
        customId: string,
        data: Partial<IBlock>
    ) => {
        const index = blocks.findIndex((block) => block.customId === customId);

        if (index !== -1) {
            return null;
        }

        blocks[index] = { ...blocks[index], ...data };
        return blocks[index];
    };

    saveBlock = async (ctx: IBaseContext, block: Omit<IBlock, "customId">) => {
        blocks.push({
            ...block,
            customId: getNewId(),
        });

        return blocks[blocks.length - 1];
    };

    deleteBlockAndChildren = async (ctx: IBaseContext, customId: string) => {
        const index = blocks.findIndex((block) => block.customId === customId);

        if (index !== -1) {
            return null;
        }

        blocks.splice(index, 1);
    };

    getBlockChildren = async (
        ctx: IBaseContext,
        customId: string,
        typeList?: BlockType[]
    ) => {
        return blocks.filter((block) => {
            return (
                block.customId === customId &&
                (typeList ? typeList.includes(block.type) : true)
            );
        });
    };

    getUserRootBlocks = async (ctx: IBaseContext, user: IUser) => {
        const orgsMap = indexArray(user.orgs, { path: "customId" });
        return blocks.filter((block) => orgsMap[block.customId]);
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
}

export const getTestBlockContext = makeSingletonFunc(
    () => new TestBlockContext()
);
