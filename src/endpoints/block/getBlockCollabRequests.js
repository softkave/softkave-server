const canReadBlock = require("./canReadBlock");
const { validateBlockParam } = require("./validation");

async function getBlockCollabRequests({
  block,
  user,
  notificationModel,
  blockModel
}) {
  block = await validateBlockParam(block);
  block = await blockModel.model.findOne({ customId: block.customId });
  await canReadBlock({ user, block });

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
