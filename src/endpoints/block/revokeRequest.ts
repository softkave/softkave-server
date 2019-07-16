import { notificationErrors } from "../../utils/notificationError";
import { validators } from "../../utils/validation-utils";
import { notificationConstants } from "../notification/constants";
import accessControlCheck from "./access-control-check";
import { blockActionsMap } from "./actions";

async function revokeRequest({
  request,
  block,
  notificationModel,
  user,
  accessControlModel
}) {
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
        customId: request,
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
    throw notificationErrors.requestHasBeenSentBefore;
  }
}

module.exports = revokeRequest;
export {};
