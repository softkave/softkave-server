const {
  errors: notificationErrors
} = require("../../utils/notificationErrorMessages");
const addOrgIdToUser = require("./addOrgIdToUser");
const { validators } = require("../../utils/validation-utils");
const { validateCollaborationRequestResponse } = require("./validation");
const {
  constants: notificationConstants
} = require("../notification/constants");

async function respondToCollaborationRequest({
  customId,
  response,
  notificationModel,
  user,
  blockModel
}) {
  customId = validators.validateUUID(customId);
  reponse = validateCollaborationRequestResponse(response);

  let request = await notificationModel.model
    .findOneAndUpdate(
      {
        customId: customId,
        "to.email": user.email,
        "statusHistory.status": {
          $not: {
            $in: [
              notificationConstants.collaborationRequestStatusTypes.accepted,
              notificationConstants.collaborationRequestStatusTypes.declined,
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
        lean: true,
        fields: "customId from"
      }
    )
    .exec();

  if (!!!request) {
    throw notificationErrors.requestDoesNotExist;
  }

  if (
    response === notificationConstants.collaborationRequestStatusTypes.accepted
  ) {
    const block = await blockModel.model
      .findOne({ customId: request.from.blockId })
      .lean()
      .exec();

    await addOrgIdToUser({ user, id: block.customId });
    return { block };
  }
}

module.exports = respondToCollaborationRequest;
