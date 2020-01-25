import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import {
  IRevokeCollaborationRequestsContext,
  IRevokeCollaborationRequestsParameters
} from "./types";

export interface IRevokeCollaborationRequestsContextParameters
  extends IBaseEndpointContextParameters {
  data: IRevokeCollaborationRequestsParameters;
}

export default class RevokeCollaborationRequestsContext
  extends BaseEndpointContext
  implements IRevokeCollaborationRequestsContext {
  public data: IRevokeCollaborationRequestsParameters;

  constructor(p: IRevokeCollaborationRequestsContextParameters) {
    super(p);
    this.data = p.data;
  }

  public async revokeCollaborationRequestsInDatabase(requestID: string) {
    const notification = await notificationModel.model
      .findOneAndUpdate(
        {
          ["customId"]: request,
          "from.blockId": block.customId,
          "statusHistory.status": {
            $not: {
              $in: [
                notificationConstants.collaborationRequestStatusTypes.accepted,
                notificationConstants.collaborationRequestStatusTypes.declined
              ]
            }
          }
        },
        {
          $push: {
            statusHistory: {
              status:
                notificationConstants.collaborationRequestStatusTypes.revoked,
              date: Date.now()
            }
          }
        },
        {
          fields: "customId"
        }
      )
      .lean()
      .exec();

    if (!notification) {
      throw notificationError.requestHasBeenSentBefore;
    }
  }
}
