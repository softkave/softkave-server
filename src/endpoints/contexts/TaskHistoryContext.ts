import { FilterQuery } from "mongoose";
import {
    ITaskHistoryItem,
    ITaskHistoryItemDocument,
    TaskHistoryAction,
} from "../../mongo/task-history";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { wrapFireAndThrowErrorAsync } from "../utils";
import { IBaseContext } from "./IBaseContext";

export interface ITaskHistoryItemContextFnQuery {
    boardId?: string;
    taskId?: string;
    action?: TaskHistoryAction;
    value?: string;
}

export interface ITaskHistoryContext {
    insert: (
        ctx: IBaseContext,
        item: ITaskHistoryItem
    ) => Promise<ITaskHistoryItem>;
    getMany: (
        ctx: IBaseContext,
        query: ITaskHistoryItemContextFnQuery,
        fromDate?: string | null,
        toDate?: string | null,
        limit?: number | null
    ) => Promise<ITaskHistoryItem[]>;
    count: (
        ctx: IBaseContext,
        query: ITaskHistoryItemContextFnQuery
    ) => Promise<number>;
    deleteTaskHistoryItems: (
        ctx: IBaseContext,
        query: ITaskHistoryItemContextFnQuery
    ) => Promise<void>;
}

export default class TaskHistoryContext implements ITaskHistoryContext {
    public getMany = wrapFireAndThrowErrorAsync(
        async (
            ctx: IBaseContext,
            query: ITaskHistoryItemContextFnQuery,
            fromDate?: string | null,
            toDate?: string | null,
            limit?: number | null
        ) => {
            const mongoQuery: FilterQuery<ITaskHistoryItemDocument> = query;
            mongoQuery.createdAt = fromDate && { $gte: fromDate };
            mongoQuery.createdAt = toDate && { $lte: toDate };
            const chainQuery = ctx.models.taskHistory.model.find(mongoQuery);

            if (limit) {
                chainQuery.limit(limit);
            }

            return await chainQuery.lean().exec();
        }
    );

    public count = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, query: ITaskHistoryItemContextFnQuery) => {
            return await ctx.models.taskHistory.model
                .countDocuments(query)
                .exec();
        }
    );

    public deleteTaskHistoryItems = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, query: ITaskHistoryItemContextFnQuery) => {
            const mongoQuery: FilterQuery<ITaskHistoryItemDocument> = query;
            await ctx.models.taskHistory.model.deleteMany(mongoQuery).exec();
        }
    );

    public async insert(ctx: IBaseContext, item: ITaskHistoryItem) {
        const insertedItem = new ctx.models.taskHistory.model(item);
        await insertedItem.save();
        return insertedItem;
    }
}

export const getTaskHistoryContext = makeSingletonFunc(
    () => new TaskHistoryContext()
);
