import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { notificationConstants } from "endpoints/notification/constants";
import { ServerError } from "utils/errors";
import logger from "utils/logger";
import {
  IRespondToCollaborationRequestContext,
  IRespondToCollaborationRequestParameters
} from "./types";

export interface IRespondToCollaborationRequestContextParameters
  extends IBaseEndpointContextParameters {
  data: IRespondToCollaborationRequestParameters;
}

export default class RespondToCollaborationRequestContext
  extends BaseEndpointContext
  implements IRespondToCollaborationRequestContext {
  public data: IRespondToCollaborationRequestParameters;

  constructor(p: IRespondToCollaborationRequestContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async addResponseToCollaborationRequestInDatabase(
    customId: string,
    email: string,
    response: string
  ) {
    try {
      return await this.notificationModel.model
        .findOneAndUpdate(
          {
            customId,
            "to.email": email,
            "statusHistory.status": {
              $not: {
                $in: [
                  notificationConstants.collaborationRequestStatusTypes
                    .accepted,
                  notificationConstants.collaborationRequestStatusTypes
                    .declined,
                  notificationConstants.collaborationRequestStatusTypes.revoked
                ]
              }
            }
          },
          {
            $push: {
              statusHistory: {
                status: response,
                date: Date.now()
              }
            }
          },
          {
            fields: "customId from"
          }
        )
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async deleteCollaborationRequestInDatabase(id: string) {
    try {
      this.notificationModel.model.deleteOne({ customId: id }).exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async addOrgToUser(orgID: string, userID: string) {
    try {
      this.userModel.model
        .updateOne({ customId: userID }, { $push: { orgs: orgID } })
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
