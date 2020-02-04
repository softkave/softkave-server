import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import {
  IGetSessionDetailsParameters,
  IGetSessionDetailsContext
} from "./types";
import logger from "utils/logger";
import { ServerError } from "utils/errors";

export interface IGetSessionDetailsContextParameters
  extends IBaseEndpointContextParameters {
  data: IGetSessionDetailsParameters;
}

export default class GetSessionDetails extends BaseEndpointContext
  implements IGetSessionDetailsContext {
  public data: IGetSessionDetailsParameters;

  constructor(p: IGetSessionDetailsContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async getNotificationCount(email: string) {
    try {
      return await this.notificationModel.model
        .estimatedDocumentCount({
          "to.email": email
        })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getAssignedTaskCount(customId: string) {
    try {
      return await this.blockModel.model
        .estimatedDocumentCount({
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
    return UOL;
  }
}
