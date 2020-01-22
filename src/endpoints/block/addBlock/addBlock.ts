import { IGetUserDataContext, IGetUserDataResult } from "./types";

async function getUserData(
  context: IGetUserDataContext
): Promise<IGetUserDataResult> {
  const user = await context.getUser();

  return {
    user
  };
}

export default getUserData;
