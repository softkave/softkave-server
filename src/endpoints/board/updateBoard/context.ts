import { BlockType } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { ServerError } from "../../../utilities/errors";
import { getDate } from "../../../utilities/fns";
import BaseContext, { IBaseContext } from "../../contexts/BaseContext";
import { IUpdateBoardContext } from "./types";

// @ts-ignore
export default class UpdateBoardContext
    extends BaseContext
    implements IUpdateBoardContext
{
    public async bulkUpdateDeletedStatusInTasks(
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
    }

    public async bulkUpdateDeletedResolutionsInTasks(
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
    }

    public async bulkRemoveDeletedLabelsInTasks(
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
    }
}
