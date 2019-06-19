const canReadBlock = require("./canReadBlock");
const deleteOrgIdFromUser = require("../user/deleteOrgIdFromUser");
const { validateBlockParam } = require("./validation");
const { getImmediateParentId } = require("./utils");

async function deleteBlock({ block, blockModel, user }) {
  block = validateBlockParam(block);
  block = await blockModel.model.findOne({ customId: block.customId });
  await canReadBlock({ block, user });
  await blockModel.model
    .deleteMany({
      $or: [{ customId: block.customId }, { parents: block.customId }]
    })
    .exec();

  const pluralizedType = `${block.type}s`;
  const update = {
    [pluralizedType]: block.customId
  };

  if (block.type === "group") {
    update.groupTaskContext = block.customId;
    update.groupProjectContext = block.customId;
  }

  await blockModel.model
    .updateOne(
      { customId: getImmediateParentId(block) },
      {
        $pull: update
      }
    )
    .exec();

  // TODO: scrub user collection for unreferenced orgIds
  await deleteOrgIdFromUser({ user, id: block.customId });
}

module.exports = deleteBlock;
