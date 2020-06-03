import { IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import appInfo from "../../../res/appInfo";
import { ServerError } from "../../../utilities/errors";
import logger from "../../../utilities/logger";
import BaseContext from "../../contexts/BaseContext";
import { IBlockContextModels } from "../../contexts/BlockContext";
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
    taskDescription: string,
    assigner: IUser,
    assignee: IUser
  ) {
    return sendAssignedTaskEmailNotification({
      taskDescription,
      email: assignee.email,
      senderOrg: org.name,
      assignee: assignee.name,
      assigner: assigner.name,
      loginLink: appInfo.loginLink,
    });
  }

  public async bulkUpdateDeletedStatusInTasks(
    models: IBlockContextModels,
    orgId: string,
    items: Array<{ oldId: string; newId: string }>
  ) {
    try {
      await models.blockModel.model.bulkWrite(
        items.map((item) => ({
          updateMany: {
            filter: { rootBlockId: orgId, type: "task", status: item.oldId },
            update: { status: item.newId },
          },
        }))
      );
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async bulkRemoveDeletedLabelsInTasks(
    models: IBlockContextModels,
    orgId: string,
    ids: string[]
  ) {
    try {
      await models.blockModel.model
        .updateMany(
          { rootBlockId: orgId },
          { $pull: { labels: { customId: { $in: ids } } } }
        )
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
