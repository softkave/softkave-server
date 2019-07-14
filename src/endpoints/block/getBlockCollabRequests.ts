const accessControlCheck = require("./accessControlCheck");
const { CRUDActionsMap } = require("./actions");

async function getBlockCollabRequests({
  block,
  notificationModel,
  user,
  accessControlModel
}) {
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    CRUDActionName: CRUDActionsMap.READ
  });

  let requests = await notificationModel.model
    .find({
      "from.blockId": block.customId
    })
    .lean()
    .exec();

  return {
    requests
  };
}

module.exports = getBlockCollabRequests;
export {};
