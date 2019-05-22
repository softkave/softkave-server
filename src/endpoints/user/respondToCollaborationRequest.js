const { RequestError } = require("../../utils/error");
const addOrgIdToUser = require("./addOrgIdToUser");

async function respondToCollaborationRequest({
  customId,
  response,
  notificationModel,
  user,
  blockModel
}) {
  // params = await validateRespondToCollaborationRequest(params);
  response = response.toLowerCase();

  const acceptableResponses = {
    accepted: true,
    declined: true
  };

  if (!acceptableResponses[response]) {
    throw new RequestError("error", "error in data");
  }

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
