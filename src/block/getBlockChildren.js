const blockModel = require("../mongo/block");
const { blockTypes, getParentsLength } = require("./utils");
const { RequestError } = require("../error");
const canReadBlock = require("./canReadBlock");

async function getBlockChildren({ block, types }, req) {
  if (types && types.length > blockTypes.length) {
    throw new RequestError("params.types", "maximum length exceeded");
  }

  let parentBlock = await blockModel.model.findOne({
    customId: block.customId
  });

  await canReadBlock(req, parentBlock);
  const blocks = await blockModel.model.find({
    parents: {
      $size: getParentsLength(parentBlock) + 1,
      $eq: parentBlock.customId
    },
    type: { $in: types || blockTypes }
  });

  return {
    blocks
  };
}

module.exports = getBlockChildren;
