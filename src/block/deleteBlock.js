const blockModel = require("../mongo/block");
const { validateBlock } = require("./validator");
const { canUserPerformAction } = require("../user/canUserPerformAction");
const deleteUserPermission = require("../user/deleteUserPermission");

async function deleteBlock({ block }, req) {
  await validateBlock(block);
  await canUserPerformAction(
    req,
    `DELETE_${block.type.toUpperCase()}`,
    block.owner || block.id
  );

  await blockModel.model
    .deleteMany({
      _id: block.id,
      parents: block.id
    })
    .exec();

  // TODO: scrub user collection for unreferenced permissions
  await deleteUserPermission(req, block.id);
}

module.exports = deleteBlock;
