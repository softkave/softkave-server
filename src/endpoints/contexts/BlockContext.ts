import { BlockType, IBlock, ITaskSprint } from "../../mongo/block";
import mongoConstants from "../../mongo/constants";
import { IUser } from "../../mongo/user";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { ServerError } from "../../utilities/errors";
import { getDate } from "../../utilities/fns";
import logger from "../../utilities/logger";
import { IBulkUpdateById } from "../../utilities/types";
import { BlockDoesNotExistError } from "../block/errors";
import { IBaseContext } from "./BaseContext";

export interface IBlockContext {
    getBlockById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<IBlock | undefined>;
    getBlockByName: (
        ctx: IBaseContext,
        name: string
    ) => Promise<IBlock | undefined>;
    bulkGetBlocksByIds: (
        ctx: IBaseContext,
        customIds: string[]
    ) => Promise<IBlock[]>;
    updateBlockById: (
        ctx: IBaseContext,
        customId: string,
        data: Partial<IBlock>,
        ensureBlockExists?: boolean
    ) => Promise<boolean | undefined>;
    bulkUpdateBlocksById: (
        ctx: IBaseContext,
        blocks: Array<IBulkUpdateById<IBlock>>
    ) => Promise<void>;
    saveBlock: (ctx: IBaseContext, block: IBlock) => Promise<IBlock>;
    markBlockDeleted: (
        ctx: IBaseContext,
        customId: string,
        user: IUser
    ) => Promise<void>;
    markBlockChildrenDeleted: (
        ctx: IBaseContext,
        customId: string,
        user: IUser
    ) => Promise<void>;
    getBlockChildren: (
        ctx: IBaseContext,
        customId: string,
        typeList?: BlockType[]
    ) => Promise<IBlock[]>;
    getUserRootBlocks: (ctx: IBaseContext, user: IUser) => Promise<IBlock[]>;
    bulkUpdateTaskSprints: (
        ctx: IBaseContext,
        sprintId: string,
        taskSprint: ITaskSprint | null,
        userId: string,
        updatedAt?: Date
    ) => Promise<void>;
    countSprintTasks: (
        ctx: IBaseContext,
        boardId: string,
        sprintId: string,
        statusIds?: string[]
    ) => Promise<number>;
}

export default class BlockContext implements IBlockContext {
    public async getBlockById(ctx: IBaseContext, customId: string) {
        try {
            return await ctx.models.blockModel.model
                .findOne({
                    customId,
                    isDeleted: false,
                })
                .lean()
                .exec();
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async bulkGetBlocksByIds(ctx: IBaseContext, customIds: string[]) {
        try {
            const query = {
                customId: { $in: customIds },
                isDeleted: false,
            };

            return await ctx.models.blockModel.model.find(query).exec();
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async updateBlockById(
        ctx: IBaseContext,
        customId: string,
        data: Partial<IBlock>,
        ensureBlockExists?: boolean
    ) {
        try {
            if (ensureBlockExists) {
                const block = await ctx.models.blockModel.model
                    .findOneAndUpdate({ customId, isDeleted: false }, data, {
                        fields: "customId",
                    })
                    .exec();

                if (block && block.customId) {
                    return true;
                } else {
                    throw new BlockDoesNotExistError(); // should we include id
                }
            } else {
                await ctx.models.blockModel.model
                    .updateOne({ customId, isDeleted: false }, data)
                    .exec();
            }
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async bulkUpdateBlocksById(
        ctx: IBaseContext,
        blocks: Array<IBulkUpdateById<IBlock>>
    ) {
        try {
            const opts = blocks.map((b) => ({
                updateOne: {
                    filter: { customId: b.id, isDeleted: false },
                    update: b.data,
                },
            }));

            await ctx.models.blockModel.model.bulkWrite(opts);
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async getBlockByName(ctx: IBaseContext, name: string) {
        try {
            return await ctx.models.blockModel.model
                .findOne({
                    lowerCasedName: name.toLowerCase(),
                    isDeleted: false,
                })
                .exec();
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async saveBlock(ctx: IBaseContext, block: IBlock) {
        try {
            const newBlock = new ctx.models.blockModel.model(block);

            await newBlock.save();

            return newBlock;
        } catch (error) {
            logger.error(error);

            // Adding a block fails with code 11000 if unique fields like customId
            if (error.code === mongoConstants.indexNotUniqueErrorCode) {
                // TODO: Implement a way to get a new customId and retry
                throw new ServerError();
            }

            console.error(error);
            throw new ServerError();
        }
    }

    public async markBlockDeleted(
        ctx: IBaseContext,
        customId: string,
        user: IUser
    ) {
        try {
            const update: Partial<IBlock> = {
                isDeleted: true,
                deletedBy: user.customId,
                deletedAt: getDate(),
            };

            await ctx.models.blockModel.model
                .updateOne({ customId }, update)
                .exec();

            await ctx.block.markBlockChildrenDeleted(ctx, customId, user);
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async getBlockChildren(
        ctx: IBaseContext,
        blockId: string,
        typeList?: BlockType[]
    ) {
        try {
            const query: any = { isDeleted: false };

            if (typeList) {
                query.type = {
                    $in: typeList,
                };
            }

            query.parent = blockId;
            const blocks = await ctx.models.blockModel.model.find(query).exec();

            return blocks;
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async markBlockChildrenDeleted(
        ctx: IBaseContext,
        customId: string,
        user: IUser
    ) {
        try {
            const update: Partial<IBlock> = {
                isDeleted: true,
                deletedBy: user.customId,
                deletedAt: getDate(),
            };

            await ctx.models.blockModel.model
                .updateMany({ parent: customId }, update)
                .exec();

            const blockChildren = await ctx.block.getBlockChildren(
                ctx,
                customId
            );

            // TODO: how can we find out if all the children are marked deleted?
            // TODO: what happens when one of them fails?
            // TODO: should we wait for all the children to be deleted?
            blockChildren.map((block) =>
                ctx.block
                    .markBlockChildrenDeleted(ctx, block.customId, user)
                    .catch((error) => {
                        // fire and forget
                        // TODO: log error
                    })
            );
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async getUserRootBlocks(ctx: IBaseContext, user: IUser) {
        try {
            const organizationIds = user.orgs.map((org) => org.customId);
            const query = {
                customId: {
                    $in: organizationIds,
                },
                isDeleted: false,
            };

            return await ctx.models.blockModel.model.find(query).lean().exec();
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async bulkUpdateTaskSprints(
        ctx: IBaseContext,
        sprintId: string,
        taskSprint: ITaskSprint | null,
        userId: string,
        updatedAt: Date = getDate()
    ) {
        try {
            await ctx.models.blockModel.model
                .updateMany(
                    {
                        "taskSprint.sprintId": sprintId,
                        isDeleted: false,
                    },
                    {
                        taskSprint,
                        updatedAt,
                        updatedBy: userId,
                    }
                )
                .exec();
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async countSprintTasks(
        ctx: IBaseContext,
        boardId: string,
        sprintId: string,
        statusIds?: string[]
    ) {
        try {
            return await ctx.models.blockModel.model
                .count({
                    parent: boardId,
                    isDeleted: false,
                    status: statusIds ? { $in: statusIds } : undefined,
                    "taskSprint.sprintId": sprintId,
                })
                .exec();
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }
}

export const getBlockContext = createSingletonFunc(() => new BlockContext());
