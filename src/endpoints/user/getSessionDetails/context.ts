import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { ServerError } from "utils/errors";
import logger from "utils/logger";
import { IGetSessionDetailsContext } from "./types";

// tslint:disable-next-line: no-empty-interface
export interface IGetSessionDetailsContextParameters
  extends IBaseEndpointContextParameters {}

export default class GetSessionDetails extends BaseEndpointContext
  implements IGetSessionDetailsContext {
  public async getNotificationsCount(email: string) {
    try {
      return await this.notificationModel.model
        .countDocuments({
          "to.email": email
        })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getAssignedTasksCount(customId: string) {
    try {
      return await this.blockModel.model
        .countDocuments({
          ["taskCollaborators.userId"]: customId,
          type: "task"
        })
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public getOrgsCount(UOL: number) {
    return Promise.resolve(UOL);
  }
}
