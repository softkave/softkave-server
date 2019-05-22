const canReadBlock = require("./canReadBlock");
const deleteOrgIdFromUser = require("../user/deleteOrgIdFromUser");
const { validateBlockParam } = require("./validation");

async function deleteBlock({ block, blockModel, user }) {
  block = validateBlockParam(block);
  block = await blockModel.model.findOne({ customId: block.customId });
  await canReadBlock({ block, user });
  await blockModel.model
    .deleteMany({
      $or: [{ customId: block.customId }, { parents: block.customId }]
    })
    .exec();

  // TODO: scrub user collection for unreferenced orgIds
  await deleteOrgIdFromUser({ user, id: block.customId });
}

module.exports = deleteBlock;
