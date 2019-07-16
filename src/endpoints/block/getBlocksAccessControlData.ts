import accessControlCheck from "./access-control-check";
import { blockActionsMap } from "./actions";
import { getRootParentID } from "./utils";

async function getBlockAccessControlData({ block, user, accessControlModel }) {
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    actionName: blockActionsMap.READ_ORG
  });

  const query = { orgId: getRootParentID(block) };
  const roles = await accessControlModel.model.find(query).exec();

  return { roles };
}

module.exports = getBlockAccessControlData;
export {};
