const {
  validateBlock
} = require("./validator");
const canUserPerformAction = require("./canUserPerformAction");
const notificationModel = require("../mongo/notification");

async function getBlockCollabRequests({
  block
}, req) {
  await validateBlock(block);
  await canUserPerformAction(req, block, "READ_REQUESTS");
  let requests = await notificationModel.model
    .find({
      "from.blockId": block.id
    })
    .lean()
    .exec();

  return {
    requests
  };
}

module.exports = getBlockCollabRequests;