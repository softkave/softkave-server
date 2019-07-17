import newToken from "./newToken";
import { IUserDocument } from "./user";
import userError from "./userError";

export interface IGetUserDataParameters {
  user: IUserDocument;
}

async function getUserData({ user }: IGetUserDataParameters) {
  if (!user) {
    throw userError.userDoesNotExist;
  }

  return { user, token: newToken(user) };
}

export default getUserData;
