import { IGetUserDataContext, IGetUserDataResult } from "./types";

async function getUserData(
  context: IGetUserDataContext
): Promise<IGetUserDataResult> {
  const orgIds = getOrgIDs(user);
  const query = {
    customId: {
      $in: orgIds
    }
  };

  const blocks = await blockModel.model
    .find(query)
    .lean()
    .exec();

  return {
    blocks
  };
}

export default getUserData;
