const blockModel = require("../mongo/block");
const canReadBlock = require("./canReadBlock");

async function updateBlock({ block, data }, req) {
  block = await blockModel.model.findOne({ customId: block.customId });
  await canReadBlock(req, block);
  data.updatedAt = Date.now();
  await blockModel.model.updateOne(
    {
      customId: block.customId
    },
    data
  );
}

module.exports = updateBlock;
