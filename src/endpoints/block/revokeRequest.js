const { RequestError } = require("../../utils/error");
const canReadBlock = require("./canReadBlock");
const { validateBlockParam } = require("./validation");
const { validateUUID } = require("../../utils/validation-utils");

async function revokeRequest({
  block,
  request,
  user,
  blockModel,
  notificationModel
}) {
  block = validateBlockParam(block);
  request = validateUUID(request);
  block = await blockModel.model.findOne({ customId: block.customId });
  await canReadBlock({ block, user });

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
