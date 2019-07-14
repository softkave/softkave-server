const accessControlCheck = require("./accessControlCheck");
const { CRUDActionsMap } = require("./actions");

async function updateBlock({
  block,
  data,
  blockModel,
  accessControlModel,
  user
}) {
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    CRUDActionName: CRUDActionsMap.UPDATE
  });

  data.updatedAt = Date.now();
  await blockModel.model.updateOne(
    {
      customId: block.customId
    },
    data
  );
}

module.exports = updateBlock;
export {};
