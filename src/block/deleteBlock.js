const blockModel = require("../mongo/block");
const canReadBlock = require("./canReadBlock");
const getUserFromReq = require("../getUserFromReq");
const deleteOrgIdFromUser = require("../user/deleteOrgIdFromUser");

async function deleteBlock({ block }, req) {
  block = await blockModel.model.findOne({ customId: block.customId });
  await canReadBlock(req, block);
  await blockModel.model
    .deleteMany({
      $or: [{ customId: block.customId }, { parents: block.customId }]
    })
    .exec();

  // TODO: scrub user collection for unreferenced orgIds
  const user = await getUserFromReq(req);
  await deleteOrgIdFromUser(user, block.customId);
}

module.exports = deleteBlock;
