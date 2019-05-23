const { RequestError } = require("../../utils/error");
const addOrgIdToUser = require("./addOrgIdToUser");
const { validateUUID } = require("../../utils/validation-utils");
const { validateCollaborationRequestResponse } = require("./validation");

async function respondToCollaborationRequest({
  customId,
  response,
  notificationModel,
  user,
  blockModel
}) {
  customId = validateUUID(customId);
  reponse = validateCollaborationRequestResponse(response);

  let request = await notificationModel.model
    .findOneAndUpdate(
      {
        customId: customId,
        "to.email": user.email,
        "statusHistory.status": {
          $not: { $in: ["accepted", "declined", "revoked"] }
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
    throw new RequestError("error", "request does not exist");
  }

  if (response === "accepted") {
    const block = await blockModel.model
      .findOne({ customId: request.from.blockId })
      .lean()
      .exec();

    await addOrgIdToUser(user, block.customId);
    return { block };
  }
}

module.exports = respondToCollaborationRequest;
