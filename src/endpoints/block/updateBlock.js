const canReadBlock = require("./canReadBlock");
const { validateBlockParam } = require("./validation");

async function updateBlock({ block, data, blockModel, user }) {
  block = validateBlockParam(block);
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
