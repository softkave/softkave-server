import { FilterQuery } from "mongoose";
import { BlockType, IBlock, ITaskSprint } from "../../mongo/block";
import { IUser } from "../../mongo/user";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { getDate } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { IUpdateItemById } from "../../utilities/types";
import { saveNewItemToDb, wrapFireAndThrowError } from "../utils";
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
        data: Partial<IBlock>
    ) => Promise<IBlock | undefined>;
    bulkUpdateBlocksById: (
        ctx: IBaseContext,
        blocks: Array<IUpdateItemById<IBlock>>
    ) => Promise<void>;
    saveBlock: (
        ctx: IBaseContext,
        block: Omit<IBlock, "customId">
    ) => Promise<IBlock>;
    markBlockDeleted: (
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
    blockExists: (
        ctx: IBaseContext,
        name: string,
        type: BlockType,
        parent?: string
    ) => Promise<boolean>;
}

export default class BlockContext implements IBlockContext {
    public getBlockById = wrapFireAndThrowError(
        (ctx: IBaseContext, customId: string) => {
            return ctx.models.blockModel.model
                .findOne({
                    customId,
                    isDeleted: false,
                })
                .lean()
                .exec();
        }
    );

    public bulkGetBlocksByIds = wrapFireAndThrowError(
        (ctx: IBaseContext, customIds: string[]) => {
            return ctx.models.blockModel.model
                .find({
                    customId: { $in: customIds },
                    isDeleted: false,
                })
                .lean()
                .exec();
        }
    );

    public updateBlockById = wrapFireAndThrowError(
        (ctx: IBaseContext, customId: string, data: Partial<IBlock>) => {
            return ctx.models.blockModel.model
                .findOneAndUpdate({ customId, isDeleted: false }, data)
                .lean()
                .exec();
        }
    );

    public bulkUpdateBlocksById = wrapFireAndThrowError(
        async (ctx: IBaseContext, blocks: Array<IUpdateItemById<IBlock>>) => {
            const opts = blocks.map((b) => ({
                updateOne: {
                    filter: { customId: b.id, isDeleted: false },
                    update: b.data,
                },
            }));

            // TODO: retry failed updates
            await ctx.models.blockModel.model.bulkWrite(opts);
        }
    );

    public getBlockByName = wrapFireAndThrowError(
        (ctx: IBaseContext, name: string) => {
            return ctx.models.blockModel.model
                .findOne({
                    lowerCasedName: name.toLowerCase(),
                    isDeleted: false,
                })
                .exec();
        }
    );

    public markBlockDeleted = wrapFireAndThrowError(
        async (ctx: IBaseContext, customId: string, user: IUser) => {
            const update: Partial<IBlock> = {
                isDeleted: true,
                deletedBy: user.customId,
                deletedAt: getDate(),
            };

            await ctx.models.blockModel.model
                .updateOne(
                    { $or: [{ customId }, { parent: customId }] },
                    update
                )
                .exec();
        }
    );

    public getBlockChildren = wrapFireAndThrowError(
        async (ctx: IBaseContext, blockId: string, typeList?: BlockType[]) => {
            const query: FilterQuery<IBlock> = {
                isDeleted: false,
                parent: blockId,
            };

            if (typeList) {
                query.type = {
                    $in: typeList,
                };
            }

            const blocks = await ctx.models.blockModel.model
                .find(query)
                .lean()
                .exec();

            return blocks;
        }
    );

    public getUserRootBlocks = wrapFireAndThrowError(
        (ctx: IBaseContext, user: IUser) => {
            const organizationIds = user.orgs.map((org) => org.customId);

            return ctx.models.blockModel.model
                .find({
                    customId: {
                        $in: organizationIds,
                    },
                    isDeleted: false,
                })
                .lean()
                .exec();
        }
    );

    public bulkUpdateTaskSprints = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            sprintId: string,
            taskSprint: ITaskSprint | null,
            userId: string,
            updatedAt: Date = getDate()
        ) => {
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
        }
    );

    public blockExists = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            name: string,
            type: BlockType,
            parent?: string
        ) => {
            const query: FilterQuery<IBlock> = {
                type,
                lowerCasedName: name.toLowerCase(),
                isDeleted: false,
            };

            if (parent) {
                query.parent = parent;
            }

            return ctx.models.blockModel.model.exists(query);
        }
    );

    public async saveBlock(ctx: IBaseContext, block: Omit<IBlock, "customId">) {
        const blockDoc = new ctx.models.blockModel.model(block);
        return saveNewItemToDb(async () => {
            blockDoc.customId = getNewId();
            await blockDoc.save();
            return blockDoc;
        });
    }
}

export const getBlockContext = createSingletonFunc(() => new BlockContext());
