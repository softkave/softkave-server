const { getParentsLength } = require("./utils");
const { validateBlockTypes } = require("./validation");
const { constants: blockConstants } = require("./constants");

async function getBlockChildren({ block, types, blockModel, isBacklog }) {
  const parentBlock = block;

  if (types) {
    types = validateBlockTypes(types);
  } else {
    types = blockConstants.blockTypesArray;
  }

  const blocks = await blockModel.model.find({
    isBacklog,
    parents: {
      $size: getParentsLength(parentBlock) + 1,
      $eq: parentBlock.customId
    },
    type: {
      $in: types
    }
  });

  return {
    blocks
  };
}

module.exports = getBlockChildren;
