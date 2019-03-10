const getUserFromReq = require("../getUserFromReq");
const notificationModel = require("../mongo/notification");
const {
  RequestError
} = require("../error");
const {
  validateUUID
} = require("../validation-utils");

async function respondToCollaborationRequest({
  id,
  response
}, req) {
  await validateUUID(id);
  response = response.trim().toLowerCase();
  let user = await getUserFromReq(req);
  let request = await notificationModel.model
    .findOneAndUpdate({
      _id: id,
      "to.email": user.email
    }, {
      $push: {
        statusHistory: {
          status: response,
          date: Date.now()
        }
      }
    }, {
      lean: true,
      fields: "_id"
    })
    .exec();

  if (!request) {
    throw new RequestError("error", "request does not exist");
  }
}

module.exports = respondToCollaborationRequest;