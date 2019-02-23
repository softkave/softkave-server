const blockModel = require("../mongo/block");
const { validateBlock } = require("./validator");
const canUserPerformAction = require("./canUserPerformAction");
const deleteUserPermission = require("../user/deleteUserPermission");
const findUserPermission = require("../user/findUserPermission");

async function deleteBlock({ block }, req) {
  // validate block
  await validateBlock(block);
  await canUserPerformAction(
    block.id,
    `DELETE`,
    await findUserPermission(req, block.id)
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
