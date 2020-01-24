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

export default getUserData;
