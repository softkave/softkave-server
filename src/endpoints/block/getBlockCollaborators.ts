import accessControlCheck from "./accessControlCheck";
import { CRUDActionsMap } from "./actions";

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

  const collaborators = await userModel.model
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
export {};
