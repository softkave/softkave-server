const getUserFromReq = require("../getUserFromReq");
const notificationModel = require("../mongo/notification");
const { RequestError } = require("../error");
const blockModel = require("../mongo/block");
const addOrgIdToUser = require("./addOrgIdToUser");
const { validateRespondToCollaborationRequest } = require("./validation");

async function respondToCollaborationRequest(params, req) {
  params = await validateRespondToCollaborationRequest(params);

  let { customId, response } = params;
  response = response.toLowerCase();

  const acceptableResponses = {
    accepted: true,
    declined: true
  };

  if (!acceptableResponses[response]) {
    throw new RequestError("error", "error in data");
  }

  // const idValue = validateUUID(customId);
  let user = await getUserFromReq(req);
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
