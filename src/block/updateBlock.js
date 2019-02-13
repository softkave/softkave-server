const blockModel = require("../mongo/block");
const { validateBlock } = require("./validator");
const { canUserPerformAction } = require("../user/canUserPerformAction");

async function updateBlock({ block, data }, req) {
  await validateBlock(block);
  await validateBlock(data);
  await canUserPerformAction(
    req,
    `UPDATE_${block.type.toUpperCase()}`,
    block.id
  );

  block.updatedAt = Date.now();
  await blockModel
    .newModel()
    .updateOne({ _id: block.id }, data)
    .exec();
}

module.exports = updateBlock;
