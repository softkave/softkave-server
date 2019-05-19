const notificationModel = require("../mongo/notification");
const canReadBlock = require("./canReadBlock");
const blockModel = require("../mongo/block");
const { validateBlockParam } = require("./validation");

async function getBlockCollabRequests({ block }, req) {
  block = await validateBlockParam(block);
  block = await blockModel.model.findOne({ customId: block.customId });
  await canReadBlock(req, block);

  let requests = await notificationModel.model
    .find({
      "from.blockId": block.customId
    })
    .lean()
    .exec();

  return {
    requests
  };
}

module.exports = getBlockCollabRequests;
