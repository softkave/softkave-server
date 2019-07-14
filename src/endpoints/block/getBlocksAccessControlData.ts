const accessControlCheck = require("./access-control-check");
const { blockActionsMap } = require("./actions");
const { getRootParentID } = require("./utils");

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
