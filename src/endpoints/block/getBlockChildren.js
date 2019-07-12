const { getParentsLength } = require("./utils");
const { validateBlockTypes } = require("./validation");
const { constants: blockConstants } = require("./constants");
const accessControlCheck = require("./accessControlCheck");
const { CRUDActionsMap } = require("./actions");

async function getBlockChildren({
  block,
  user,
  accessControlModel,
  types,
  blockModel,
  isBacklog
}) {
  const parentBlock = block;
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    CRUDActionName: CRUDActionsMap.READ
  });

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
