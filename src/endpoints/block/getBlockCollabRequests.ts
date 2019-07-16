import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";

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

  const requests = await notificationModel.model
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
