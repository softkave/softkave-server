const {
  errors: notificationErrors
} = require("../../utils/notificationErrorMessages");
const { validators } = require("../../utils/validation-utils");
const {
  constants: notificationConstants
} = require("../notification/constants");

async function revokeRequest({ request, block, notificationModel }) {
  request = validators.validateUUID(request);

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
