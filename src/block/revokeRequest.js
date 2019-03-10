const notificationModel = require("../mongo/notification");
const {
  validateBlock
} = require("./validator");
const {
  RequestError
} = require("../error");
const canUserPerformAction = require("./canUserPerformAction");
const {
  validateUUID
} = require("../validation-utils");

async function revokeRequest({
  block,
  request
}, req) {
  await validateBlock(block);
  validateUUID(request);

  await canUserPerformAction(req, block, "REVOKE_REQUEST");
  let notification = await notificationModel.model
    .findOneAndUpdate({
      _id: request
    }, {
      $push: {
        statusHistory: {
          status: "revoked",
          date: Date.now()
        }
      }
    }, {
      fields: "_id"
    })
    .lean()
    .exec();

  if (!notification) {
    throw new RequestError("error", "request does not exist");
  }
}

module.exports = revokeRequest;