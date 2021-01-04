import { FilterQuery } from "mongoose";
import {
    BlockType,
    IBlock,
    IBlockDocument,
    ITaskSprint,
} from "../../mongo/block";
import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDate } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { BlockDoesNotExistError } from "../block/errors";
import { saveNewItemToDb, wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface IBlockContext {
    getBlockById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<IBlock | undefined>;
    assertGetBlockById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<IBlock>;
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
    saveBlock: (
        ctx: IBaseContext,
        block: Omit<IBlock, "customId">
    ) => Promise<IBlock>;
    deleteBlock: (ctx: IBaseContext, customId: string) => Promise<void>;
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
        updatedAt?: Date,
        excludeStatusIds?: string[]
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

    public assertGetBlockById = wrapFireAndThrowError(
        async (ctx: IBaseContext, customId: string) => {
            const block = await ctx.block.getBlockById(ctx, customId);

            if (!block) {
                throw new BlockDoesNotExistError();
            }

            return block;
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
                .findOneAndUpdate({ customId, isDeleted: false }, data, {
                    new: true,
                })
                .lean()
                .exec();
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

    public deleteBlock = wrapFireAndThrowError(
        async (ctx: IBaseContext, customId: string) => {
            await ctx.models.blockModel.model
                .deleteMany({ $or: [{ customId }, { parent: customId }] })
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
            updatedAt: Date = getDate(),
            excludeStatusIds: string[] = []
        ) => {
            const query: FilterQuery<IBlockDocument> = {
                "taskSprint.sprintId": sprintId,
                isDeleted: false,
            };

            if (excludeStatusIds.length > 0) {
                query.status = { $nin: excludeStatusIds };
            }

            await ctx.models.blockModel.model
                .updateMany(query, {
                    taskSprint,
                    updatedAt,
                    updatedBy: userId,
                })
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

export const getBlockContext = makeSingletonFunc(() => new BlockContext());
