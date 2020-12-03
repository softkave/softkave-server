import { ISprint } from "../../mongo/sprint";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import getNewId from "../../utilities/getNewId";
import { IUpdateItemById } from "../../utilities/types";
import { saveNewItemToDb, wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface ISprintContext {
    saveSprint: (
        ctx: IBaseContext,
        sprint: Omit<ISprint, "customId">
    ) => Promise<ISprint>;
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
    ) => Promise<ISprint | undefined>;

    /**
     * Don't use to update array fields, cause it'll throw an error
     * about using atomic fields
     */
    bulkUpdateSprintsById: (
        ctx: IBaseContext,
        sprints: Array<IUpdateItemById<ISprint>>
    ) => Promise<void>;
    sprintExists: (
        ctx: IBaseContext,
        name: string,
        boardId: string
    ) => Promise<boolean>;
    deleteSprint: (ctx: IBaseContext, sprintId: string) => Promise<void>;
    updateUnstartedSprints: (
        ctx: IBaseContext,
        boardId: string,
        data: Partial<ISprint>
    ) => Promise<void>;
}

export default class SprintContext implements ISprintContext {
    public getSprintById = wrapFireAndThrowError(
        (ctx: IBaseContext, customId: string) => {
            return ctx.models.sprintModel.model
                .findOne({
                    customId,
                })
                .lean()
                .exec();
        }
    );

    public bulkGetSprintsByIds = wrapFireAndThrowError(
        (ctx: IBaseContext, customIds: string[]) => {
            return ctx.models.sprintModel.model
                .find({
                    customId: { $in: customIds },
                })
                .lean()
                .exec();
        }
    );

    public updateSprintById = wrapFireAndThrowError(
        (ctx: IBaseContext, customId: string, data: Partial<ISprint>) => {
            return ctx.models.sprintModel.model
                .findOneAndUpdate({ customId }, data, { new: true })
                .lean()
                .exec();
        }
    );

    public bulkUpdateSprintsById = wrapFireAndThrowError(
        async (ctx: IBaseContext, data: Array<IUpdateItemById<ISprint>>) => {
            const opts = data.map((b) => ({
                updateOne: {
                    filter: { customId: b.id },
                    update: b.data,
                },
            }));

            await ctx.models.sprintModel.model.bulkWrite(opts);
        }
    );

    public getSprintsByBoardId = wrapFireAndThrowError(
        (ctx: IBaseContext, boardId: string) => {
            return ctx.models.sprintModel.model
                .find({
                    boardId,
                })
                .lean()
                .exec();
        }
    );

    public sprintExists = wrapFireAndThrowError(
        (ctx: IBaseContext, name: string, boardId: string) => {
            return ctx.models.sprintModel.model.exists({
                boardId,
                name: name.toLowerCase(),
            });
        }
    );

    public deleteSprint = wrapFireAndThrowError(
        async (ctx: IBaseContext, sprintId: string) => {
            await ctx.models.sprintModel.model
                .deleteOne({
                    customId: sprintId,
                })
                .exec();
        }
    );

    public updateUnstartedSprints = wrapFireAndThrowError(
        async (ctx: IBaseContext, boardId: string, data: Partial<ISprint>) => {
            await ctx.models.sprintModel.model
                .updateMany(
                    {
                        boardId,
                        startDate: null,
                    },
                    data
                )
                .exec();
        }
    );

    public async saveSprint(
        ctx: IBaseContext,
        sprint: Omit<ISprint, "customId">
    ) {
        const sprintDoc = new ctx.models.sprintModel.model(sprint);

        return saveNewItemToDb(async () => {
            sprintDoc.customId = getNewId();
            await sprintDoc.save();
            return sprintDoc;
        });
    }
}

export const getSprintContext = makeSingletonFunc(() => new SprintContext());
