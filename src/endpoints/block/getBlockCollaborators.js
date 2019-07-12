const accessControlCheck = require("./accessControlCheck");
const { CRUDActionsMap } = require("./actions");

async function getBlockCollaborators({
  block,
  userModel,
  user,
  accessControlModel
}) {
  await accessControlCheck({
    user,
    block,
    accessControlModel,
    CRUDActionName: CRUDActionsMap.READ
  });

  let collaborators = await userModel.model
    .find(
      {
        orgs: block.customId
      },
      "name email createdAt customId"
    )
    .lean()
    .exec();

  return {
    collaborators
  };
}

module.exports = getBlockCollaborators;
