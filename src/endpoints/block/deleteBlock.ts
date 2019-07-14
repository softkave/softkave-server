const deleteOrgIDFromUser = require("../user/deleteOrgIDFromUser");
const { getImmediateParentID } = require("./utils");
const { blockConstants } = require("./constants");
const accessControlCheck = require("./access-control-check");
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
      { customId: getImmediateParentID(block) },
      {
        $pull: update
      }
    )
    .exec();

  // TODO: scrub user collection for unreferenced orgIds
  await deleteOrgIDFromUser({ user, id: block.customId });
}

module.exports = deleteBlock;
export {};
