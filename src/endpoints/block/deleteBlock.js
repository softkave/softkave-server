const deleteOrgIdFromUser = require("../user/deleteOrgIdFromUser");
const { getImmediateParentId } = require("./utils");
const { constants: blockConstants } = require("./constants");
const accessControlCheck = require("./accessControlCheck");
const { CRUDActionsMap } = require("./actions");

async function deleteBlock({ block, blockModel, user, accessControlModel }) {
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    CRUDActionName: CRUDActionsMap.DELETE
  });

  await blockModel.model
    .deleteMany({
      $or: [{ customId: block.customId }, { parents: block.customId }]
    })
    .exec();

  const pluralizedType = `${block.type}s`;
  const update = {
    [pluralizedType]: block.customId
  };

  if (block.type === blockConstants.blockTypes.group) {
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
