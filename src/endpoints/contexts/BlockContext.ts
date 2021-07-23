import { FilterQuery } from "mongoose";
import {
    BlockType,
    IBlock,
    IBlockDocument,
    ITaskSprint,
} from "../../mongo/block";
import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import cast, { getDate } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import OperationError from "../../utilities/OperationError";
import { BlockDoesNotExistError } from "../block/errors";
import { IOrganization } from "../organization/types";
import { saveNewItemToDb, wrapFireAndThrowErrorAsync } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface IBlockContext {
    getBlockById: <T = IBlock>(
        ctx: IBaseContext,
        customId: string
    ) => Promise<T | undefined>;
    assertGetBlockById: <T = IBlock>(
        ctx: IBaseContext,
        customId: string,
        throwError?: () => void
    ) => Promise<T>;
    assertBlockById: (
        ctx: IBaseContext,
        customId: string,
        throwError?: () => void
    ) => Promise<boolean>;
    bulkGetBlocksByIds: (
        ctx: IBaseContext,
        customIds: string[]
    ) => Promise<IBlock[]>;
    updateBlockById: <T = IBlock>(
        ctx: IBaseContext,
        customId: string,
        data: Partial<IBlock>
    ) => Promise<T | undefined>;
    saveBlock: <T = IBlock>(
        ctx: IBaseContext,
        block: Omit<IBlock, "customId">
    ) => Promise<T>;
    deleteBlockAndChildren: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<void>;
    getBlockChildren: <T = IBlock>(
        ctx: IBaseContext,
        customId: string,
        typeList?: BlockType[]
    ) => Promise<T[]>;
    getUserRootBlocks: (ctx: IBaseContext, user: IUser) => Promise<IBlock[]>;
    getUserOrganizations: (
        ctx: IBaseContext,
        user: IUser
    ) => Promise<IOrganization[]>;
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
    public getBlockById = wrapFireAndThrowErrorAsync(
        async <T = IBlock>(ctx: IBaseContext, customId: string) => {
            return cast<T>(
                await ctx.models.blockModel.model
                    .findOne({
                        customId,
                        isDeleted: false,
                    })
                    .lean()
                    .exec()
            );
        }
    );

    public assertGetBlockById = wrapFireAndThrowErrorAsync(
        async <T = IBlock>(
            ctx: IBaseContext,
            customId: string,
            throwError?: () => void
        ) => {
            const block = await ctx.block.getBlockById(ctx, customId);

            if (!block) {
                if (throwError) {
                    throwError();
                }

                throw new BlockDoesNotExistError();
            }

            return cast<T>(block);
        }
    );

    public assertBlockById = wrapFireAndThrowErrorAsync(
        async (
            ctx: IBaseContext,
            customId: string,
            throwError?: () => void
        ) => {
            const exists = await ctx.models.blockModel.model.exists({
                customId,
                isDeleted: false,
            });

            if (!exists) {
                if (throwError) {
                    throwError();
                }

                throw new BlockDoesNotExistError();
            }

            return exists;
        }
    );

    public bulkGetBlocksByIds = wrapFireAndThrowErrorAsync(
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

    public updateBlockById = wrapFireAndThrowErrorAsync(
        async <T = IBlock>(
            ctx: IBaseContext,
            customId: string,
            data: Partial<IBlock>
        ) => {
            const block = await ctx.models.blockModel.model
                .findOneAndUpdate({ customId, isDeleted: false }, data, {
                    new: true,
                })
                .lean()
                .exec();

            return cast<T | undefined>(block);
        }
    );

    public deleteBlockAndChildren = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, customId: string) => {
            await ctx.models.blockModel.model
                .deleteMany({ $or: [{ customId }, { parent: customId }] })
                .exec();
        }
    );

    public getBlockChildren = wrapFireAndThrowErrorAsync(
        async <T = IBlock>(
            ctx: IBaseContext,
            blockId: string,
            typeList?: BlockType[]
        ) => {
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

            return cast<T[]>(blocks);
        }
    );

    public getUserRootBlocks = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, user: IUser) => {
            const organizationIds = user.organizations.map(
                (organization) => organization.customId
            );

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

    // TODO: seems similar to getUserRootBlocks, refactor.
    public getUserOrganizations = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, user: IUser) => {
            const organizationIds = user.organizations.map(
                (organization) => organization.customId
            );
            const organizations = await ctx.models.blockModel.model
                .find({
                    customId: {
                        $in: organizationIds,
                    },
                    isDeleted: false,
                })
                .lean()
                .exec();

            return cast<IOrganization[]>(organizations);
        }
    );

    public bulkUpdateTaskSprints = wrapFireAndThrowErrorAsync(
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

    public blockExists = wrapFireAndThrowErrorAsync(
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

    public async saveBlock<T = IBlock>(
        ctx: IBaseContext,
        block: Omit<IBlock, "customId">
    ) {
        const blockDoc = new ctx.models.blockModel.model(block);
        const newBlock = await saveNewItemToDb(async () => {
            blockDoc.customId = getNewId();
            await blockDoc.save();
            return blockDoc;
        });

        return cast<T>(newBlock);
    }
}

export const getBlockContext = makeSingletonFunc(() => new BlockContext());
