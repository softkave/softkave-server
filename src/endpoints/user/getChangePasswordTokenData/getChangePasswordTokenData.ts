import { userEndpoints } from "../constants";
import { InvalidCredentialsError } from "../errors";
import UserToken from "../UserToken";
import {
  IGetChangePasswordTokenDataContext,
  IGetChangePasswordTokenDataResult
} from "./types";

async function getChangePasswordTokenData(
  context: IGetChangePasswordTokenDataContext
): Promise<IGetChangePasswordTokenDataResult> {
  const tokenData = context.getRequestToken();

  if (!UserToken.containsAudience(tokenData, userEndpoints.changePassword)) {
    throw new InvalidCredentialsError();
  }

  // TODO: should we check if the user exists?

  return {
    email: tokenData.sub.email,
    issuedAt: tokenData.iat,
    expires: tokenData.exp
  };
}

export default getChangePasswordTokenData;
