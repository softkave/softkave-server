const {
  errors: notificationErrors
} = require("../../utils/notificationErrorMessages");
const { validators } = require("../../utils/validation-utils");
const {
  constants: notificationConstants
} = require("../notification/constants");
const accessControlCheck = require("./accessControlCheck");
const { blockActionsMap } = require("./actions");

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

  let notification = await notificationModel.model
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
