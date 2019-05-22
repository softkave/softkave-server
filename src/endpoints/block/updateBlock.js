const canReadBlock = require("./canReadBlock");

async function updateBlock({ block, data, blockModel }) {
  block = await blockModel.model.findOne({ customId: block.customId });
  await canReadBlock({ block, user });
  data.updatedAt = Date.now();
  await blockModel.model.updateOne(
    {
      customId: block.customId
    },
    data
  );
}

module.exports = updateBlock;
