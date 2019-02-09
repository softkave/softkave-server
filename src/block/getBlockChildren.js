const blockModel = require("../mongo/block");
const { validateBlock } = require("./validator");
const { canUserPerformAction } = require("../user/canUserPerformAction");
const { blockTypes } = require("./utils");

async function getBlockChildren({ block, types }, req) {
  await validateBlock(block);
  await canUserPerformAction(
    req,
    (types || blockTypes).map(type => `READ_${type.toUpperCase()}`),
    block.owner
  );

  const blocks = await blockModel.model.find({
    owner: block.owner,
    parents: block.id,
    type: { $in: types || blockTypes }
  });

  return { blocks };
}

module.exports = getBlockChildren;
