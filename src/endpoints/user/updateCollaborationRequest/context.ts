import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import {
  IUpdateCollaborationRequestParameters,
  IUpdateCollaborationRequestContext
} from "./types";
import logger from "utils/logger";
import { ServerError } from "utils/errors";

export interface IUpdateCollaborationRequestContextParameters
  extends IBaseEndpointContextParameters {
  data: IUpdateCollaborationRequestParameters;
}

export default class UpdateCollaborationRequest extends BaseEndpointContext
  implements IUpdateCollaborationRequestContext {
  public data: IUpdateCollaborationRequestParameters;

  constructor(p: IUpdateCollaborationRequestContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async getUserNotificationAndUpdate(
    customId: string,
    email: string,
    data: any
  ) {
    try {
      return await this.notificationModel.model
        .findOneAndUpdate(
          {
            customId,
            "to.email": email
          },
          data,
          {
            fields: "customId"
          }
        )
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
