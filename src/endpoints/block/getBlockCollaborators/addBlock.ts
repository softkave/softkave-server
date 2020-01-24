import { IGetUserDataContext, IGetUserDataResult } from "./types";

async function getUserData(
  context: IGetUserDataContext
): Promise<IGetUserDataResult> {
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

export default getUserData;
