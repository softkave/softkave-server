const { getParentsLength } = require("./utils");
const canReadBlock = require("./canReadBlock");
const { validateBlockParam, validateBlockTypes } = require("./validation");
const { blockTypes } = require("./constants");

async function getBlockChildren({ block, types, blockModel }) {
  block = validateBlockParam(block);

  if (types) {
    types = validateBlockTypes(types);
  } else {
    types = blockTypes;
  }

  let parentBlock = await blockModel.model.findOne({
    customId: block.customId
  });

  await canReadBlock({ user, block: parentBlock });
  const blocks = await blockModel.model.find({
    parents: {
      $size: getParentsLength(parentBlock) + 1,
      $eq: parentBlock.customId
    },
    type: { $in: types }
  });

  return {
    blocks
  };
}

module.exports = getBlockChildren;
