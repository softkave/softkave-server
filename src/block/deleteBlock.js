const blockModel = require("../mongo/block");
const { validateBlock } = require("./validator");
const { canUserPerformAction } = require("../user/canUserPerformAction");
const getUserFromReq = require("../getUserFromReq");
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

  const user = await getUserFromReq(req);
  if (!block.owner || block.owner === block.id) {
    // TODO: scrub user collection for unreferenced permissions
    await deleteUserPermission(user, block.id);
  }
}

module.exports = deleteBlock;
