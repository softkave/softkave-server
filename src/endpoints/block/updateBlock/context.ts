import { BlockType, IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import appInfo from "../../../res/appInfo";
import { ServerError } from "../../../utilities/errors";
import { getDate } from "../../../utilities/fns";
import logger from "../../../utilities/logger";
import BaseContext, { IBaseContext } from "../../contexts/BaseContext";
import transferBlock from "../transferBlock/transferBlock";
import sendAssignedTaskEmailNotification from "./sendAssignedTaskEmailNotification";
import { IUpdateBlockContext } from "./types";

export default class UpdateBlockContext extends BaseContext
  implements IUpdateBlockContext {
  public async transferBlock(context, instData) {
    await transferBlock(context, instData);
  }

  public async sendAssignedTaskEmailNotification(
    org: IBlock,
    taskName: string,
    taskDescription: string,
    assigner: IUser,
    assignee: IUser
  ) {
    return sendAssignedTaskEmailNotification({
      taskName,
      taskDescription,
      email: assignee.email,
      senderOrg: org.name,
      assignee: assignee.name,
      assigner: assigner.name,
      loginLink: appInfo.loginLink,
    });
  }

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
      logger.error(error);
      throw new ServerError();
    }
  }

  public async bulkRemoveDeletedLabelsInTasks(
    ctx: IBaseContext,
    orgId: string,
    ids: string[]
  ) {
    try {
      await ctx.models.blockModel.model.bulkWrite(
        ids.map((id) => ({
          updateMany: {
            filter: { rootBlockId: orgId },
            update: { $pull: { labels: { customId: id } } },
          },
        }))
      );
    } catch (error) {
      logger.error(error);

      // TODO: how can we return the right error here, like "error updating affected tasks"
      // instead of just server error?
      throw new ServerError();
    }
  }
}
