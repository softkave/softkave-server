import mongoConstants from "../../mongo/constants";
import { ISprint } from "../../mongo/sprint";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";
import { IBulkUpdateById } from "../../utilities/types";
import { BlockDoesNotExistError } from "../block/errors";
import { IBaseContext } from "./BaseContext";

export interface ISprintContext {
    saveSprint: (ctx: IBaseContext, block: ISprint) => Promise<ISprint>;
    getSprintById: (
        ctx: IBaseContext,
        customId: string
    ) => Promise<ISprint | undefined>;
    updateSprintById: (
        ctx: IBaseContext,
        customId: string,
        data: Partial<ISprint>,
        ensureBlockExists?: boolean
    ) => Promise<boolean | undefined>;
    bulkUpdateSprintsById: (
        ctx: IBaseContext,
        blocks: Array<IBulkUpdateById<ISprint>>
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
        data: Partial<ISprint>,
        ensureBlockExists?: boolean
    ) {
        try {
            if (ensureBlockExists) {
                const sprint = await ctx.models.sprintModel.model
                    .findOneAndUpdate({ customId }, data, {
                        fields: "customId",
                    })
                    .exec();

                if (sprint && sprint.customId) {
                    return true;
                } else {
                    throw new BlockDoesNotExistError(); // should we include id
                }
            } else {
                await ctx.models.sprintModel.model
                    .updateOne({ customId }, data)
                    .exec();
            }
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
}

export const getSprintContext = createSingletonFunc(() => new SprintContext());
