import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { ServerError } from "utils/errors";
import logger from "utils/logger";
import {
  IUpdateCollaborationRequestContext,
  IUpdateCollaborationRequestParameters
} from "./types";

export interface IUpdateCollaborationRequestContextParameters
  extends IBaseEndpointContextParameters {
  data: IUpdateCollaborationRequestParameters;
}

export default class UpdateCollaborationRequestContext
  extends BaseEndpointContext
  implements IUpdateCollaborationRequestContext {
  public data: IUpdateCollaborationRequestParameters;

  constructor(p: IUpdateCollaborationRequestContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async updateNotificationInStorage(
    customId: string,
    email: string,
    data: any
  ) {
    try {
      return await this.notificationModel.model
        .updateOne(
          {
            customId,
            "to.email": email
          },
          data
        )
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
