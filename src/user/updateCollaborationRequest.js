const getUserFromReq = require("../getUserFromReq");
const notificationModel = require("../mongo/notification");
const {
  RequestError
} = require("../error");
const {
  validateUUID
} = require("../validation-utils");

async function updateCollaborationRequest({
  id,
  data
}, req) {
  // validateUUID(id);
  const user = await getUserFromReq(req);
  let notification = await notificationModel.model
    .findOneAndUpdate({
        _id: id,
        "to.email": user.email
      },
      data, {
        lean: true,
        fields: "_id"
      }
    )
    .exec();

  if (!notification) {
    throw new RequestError("error", "notification does not exist");
  }
}

module.exports = updateCollaborationRequest;