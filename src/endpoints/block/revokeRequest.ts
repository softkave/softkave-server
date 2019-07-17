import AccessControlModel from "../../mongo/access-control/AccessControlModel";
import NotificationModel from "../../mongo/notification/NotificationModel";
import notificationError from "../../utils/notificationError";
import { validators } from "../../utils/validation-utils";
import { notificationConstants } from "../notification/constants";
import { IUserDocument } from "../user/user";
import accessControlCheck from "./accessControlCheck";
import { blockActionsMap } from "./actions";
import { IBlockDocument } from "./block";

export interface IRevokeRequestParameters {
  request: string;
  block: IBlockDocument;
  notificationModel: NotificationModel;
  user: IUserDocument;
  accessControlModel: AccessControlModel;
}

async function revokeRequest({
  request,
  block,
  notificationModel,
  user,
  accessControlModel
}: IRevokeRequestParameters) {
  request = validators.validateUUID(request);
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    actionName: blockActionsMap.REVOKE_COLLABORATION_REQUEST
  });

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

export default revokeRequest;
