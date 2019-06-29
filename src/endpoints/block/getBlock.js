const canReadBlock = require("./canReadBlock");
const { validateBlockParam } = require("./validation");
const { errors: blockErrors } = require("../../utils/blockErrorMessages");

async function getBlock({
  block,
  blockModel,
  isRequired,
  checkPermission,
  user
}) {
  block = validateBlockParam(block);
  block = await blockModel.model.findOne({ customId: block.customId });

  if (!block && isRequired) {
    throw blockErrors.blockNotFound;
  }

  if (checkPermission && user) {
    await canReadBlock({ block, user });
  }

  return block;
}

module.exports = getBlock;
