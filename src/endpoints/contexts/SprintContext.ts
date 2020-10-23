import { ITaskSprint } from "../../mongo/block";
import mongoConstants from "../../mongo/constants";
import { IBoardSprintOptions, ISprint } from "../../mongo/sprint";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";
import { IBulkUpdateById } from "../../utilities/types";
import { IBaseContext } from "./BaseContext";

export interface ISprintContext {
    saveSprint: (ctx: IBaseContext, sprint: ISprint) => Promise<ISprint>;
    getSprintById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<ISprint | undefined>;
    getSprintsByBoardId: (
        ctx: IBaseContext,
        boardId: string
    ) => Promise<ISprint[]>;
    updateSprintById: (
        ctx: IBaseContext,
        customId: string,
        data: Partial<ISprint>
    ) => Promise<void>;
    bulkUpdateSprintsById: (
        ctx: IBaseContext,
        sprints: Array<IBulkUpdateById<ISprint>>
    ) => Promise<void>;
    sprintExists: (
        ctx: IBaseContext,
        name: string,
        boardId: string
    ) => Promise<boolean>;
    deleteSprint: (ctx: IBaseContext, sprintId: string) => Promise<void>;
    countSprints: (ctx: IBaseContext, boardId: string) => Promise<number>;
    getSprintByIndex: (
        ctx: IBaseContext,
        boardId: string,
        index: number
    ) => Promise<ISprint | undefined>;
    updateUnstartedSprints: (
        ctx: IBaseContext,
        boardId: string,
        data: Partial<ISprint>
    ) => Promise<void>;
}

export default class SprintContext implements ISprintContext {
    public async getSprintById(ctx: IBaseContext, customId: string) {
        try {
            return await ctx.models.sprintModel.model
                .findOne({
                    customId,
                })
                .lean()
                .exec();
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async bulkGetSprintsByIds(ctx: IBaseContext, customIds: string[]) {
        try {
            const query = {
                customId: { $in: customIds },
            };

            return await ctx.models.sprintModel.model.find(query).exec();
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async updateSprintById(
        ctx: IBaseContext,
        customId: string,
        data: Partial<ISprint>
    ) {
        try {
            await ctx.models.sprintModel.model
                .updateOne({ customId }, data)
                .exec();
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async bulkUpdateSprintsById(
        ctx: IBaseContext,
        blocks: Array<IBulkUpdateById<ISprint>>
    ) {
        try {
            const opts = blocks.map((b) => ({
                updateOne: {
                    filter: { customId: b.id },
                    update: b.data,
                },
            }));

            await ctx.models.sprintModel.model.bulkWrite(opts);
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async saveSprint(ctx: IBaseContext, sprint: ISprint) {
        try {
            const newSprint = new ctx.models.sprintModel.model(sprint);
            await newSprint.save();
            return newSprint;
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

    public async getSprintsByBoardId(ctx: IBaseContext, boardId: string) {
        try {
            return await ctx.models.sprintModel.model
                .find({
                    boardId,
                })
                .lean()
                .exec();
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async sprintExists(
        ctx: IBaseContext,
        name: string,
        boardId: string
    ) {
        try {
            return await ctx.models.sprintModel.model.exists({
                boardId,
                name: name.toLowerCase(),
            });
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async deleteSprint(ctx: IBaseContext, sprintId: string) {
        try {
            await ctx.models.sprintModel.model
                .deleteOne({
                    customId: sprintId,
                })
                .exec();
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async countSprints(ctx: IBaseContext, boardId: string) {
        try {
            return await ctx.models.sprintModel.model
                .count({
                    boardId,
                })
                .exec();
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async getSprintByIndex(
        ctx: IBaseContext,
        boardId: string,
        index: number
    ) {
        try {
            return await ctx.models.sprintModel.model
                .findOne({
                    boardId,
                    sprintIndex: index,
                })
                .lean()
                .exec();
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async updateUnstartedSprints(
        ctx: IBaseContext,
        boardId: string,
        data: Partial<ISprint>
    ) {
        try {
            await ctx.models.sprintModel.model
                .updateMany(
                    {
                        boardId,
                        startDate: null,
                    },
                    data
                )
                .exec();
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }
}

export const getSprintContext = createSingletonFunc(() => new SprintContext());
