const notificationModel = require("../mongo/notification");
const { RequestError } = require("../error");
const canReadBlock = require("./canReadBlock");

async function revokeRequest({ block, request }, req) {
  block = await blockModel.model.findOne({ customId: block.customId });
  await canReadBlock(req, block);
  let notification = await notificationModel.model
    .findOneAndUpdate(
      {
        customId: request,
        "statusHistory.status": { $not: { $in: ["accepted", "declined"] } }
      },
      {
        $push: {
          statusHistory: {
            status: "revoked",
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
    throw new RequestError(
      "error",
      "request does not exist, or request has been accepted or declined"
    );
  }
}

module.exports = revokeRequest;
