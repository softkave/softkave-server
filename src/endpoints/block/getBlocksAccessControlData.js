const accessControlCheck = require("./accessControlCheck");
const { blockActionsMap } = require("./actions");
const { getRootParentId } = require("./utils");

async function getBlocksAccessControlData({ block, user, accessControlModel }) {
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    actionName: blockActionsMap.READ_ORG
  });

  const query = { orgId: getRootParentId(block) };
  const roles = await accessControlModel.model.find(query).exec();

  return { roles };
}

module.exports = getBlocksAccessControlData;
