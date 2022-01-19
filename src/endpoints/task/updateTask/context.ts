import { BlockType, IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { ServerError } from "../../../utilities/errors";
import { getDate } from "../../../utilities/fns";
import { IBaseContext } from "../../contexts/IBaseContext";
import transferTask from "../transferTask/handler";
import sendAssignedTaskEmailNotification from "./sendAssignedTaskEmailNotification";
import { IUpdateTaskContext } from "./types";

export function makeUpdateTaskContext(
    context: IBaseContext
): IUpdateTaskContext {
    return {
        ...context,
        async transferTask(context, instData) {
            return await transferTask(context, instData);
        },

        async sendAssignedTaskEmailNotification(
            ctx: IBaseContext,
            board: IBlock,
            taskName: string,
            taskDescription: string,
            assigner: IUser,
            assignee: IUser
        ) {
            return sendAssignedTaskEmailNotification(ctx, {
                taskName,
                taskDescription,
                email: assignee.email,
                board: board.name,
                assignee: assignee.name,
                assigner: assigner.name,
                loginLink: ctx.appVariables.loginPath,
            });
        },

        async bulkUpdateDeletedStatusInTasks(
            ctx: IBaseContext,
            parentId: string,
            items: Array<{ oldId: string; newId: string }>,
            user: IUser
        ) {
            try {
                await ctx.models.blockModel.model.bulkWrite(
                    items.map((item) => ({
                        updateMany: {
                            filter: {
                                parent: parentId,
                                type: BlockType.Task,
                                status: item.oldId,
                            },

                            // TODO: how can we add the context of the status change, and how can we add it to audit log?
                            update: {
                                status: item.newId,
                                statusAssignedAt: getDate(),
                                statusAssignedBy: user.customId,
                            },
                        },
                    }))
                );
            } catch (error) {
                console.error(error);
                throw new ServerError();
            }
        },

        async bulkUpdateDeletedResolutionsInTasks(
            ctx: IBaseContext,
            parentId: string,
            ids: string[]
        ) {
            try {
                await ctx.models.blockModel.model
                    .updateMany(
                        {
                            parent: parentId,
                            type: BlockType.Task,
                            taskResolution: { $in: ids },
                        },
                        { taskResolution: null }
                    )
                    .exec();
            } catch (error) {
                console.error(error);
                throw new ServerError();
            }
        },

        async bulkRemoveDeletedLabelsInTasks(
            ctx: IBaseContext,
            parentId: string,
            ids: string[]
        ) {
            try {
                await ctx.models.blockModel.model.bulkWrite(
                    ids.map((id) => ({
                        updateMany: {
                            filter: {
                                parentId,
                                // tslint:disable-next-line: object-literal-key-quotes
                                type: BlockType.Task,
                                "labels.customId": id,
                            },
                            update: { $pull: { labels: { customId: id } } },
                        },
                    }))
                );
            } catch (error) {
                console.error(error);

                // TODO: how can we return the right error here, like "error updating affected tasks"
                // instead of just server error?
                throw new ServerError();
            }
        },
    };
}