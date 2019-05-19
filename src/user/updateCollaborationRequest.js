const getUserFromReq = require("../getUserFromReq");
const notificationModel = require("../mongo/notification");
const { RequestError } = require("../error");
const { validateUUID } = require("../validation-utils");
const { validateCollaborationRequest } = require("./validation");

async function updateCollaborationRequest({ customId, data }, req) {
  customId = validateUUID(customId);
  data = validateCollaborationRequest(data);

  const user = await getUserFromReq(req);
  let notification = await notificationModel.model
    .findOneAndUpdate(
      {
        customId: customId,
        "to.email": user.email
      },
      data,
      {
        lean: true,
        fields: "customId"
      }
    )
    .exec();

  if (!!!notification) {
    throw new RequestError("error", "notification does not exist");
  }
}

module.exports = updateCollaborationRequest;
