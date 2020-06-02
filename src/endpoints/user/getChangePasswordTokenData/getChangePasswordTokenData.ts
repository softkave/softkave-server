import { JWTEndpoints } from "../../utils";
import { InvalidCredentialsError } from "../errors";
import UserToken from "../UserToken";
import { GetChangePasswordTokenDataEndpoint } from "./types";

const getChangePasswordTokenData: GetChangePasswordTokenDataEndpoint = async (
  context,
  instData
) => {
  const tokenData = context.session.getRequestToken(context.models, instData);

  if (!UserToken.containsAudience(tokenData, JWTEndpoints.ChangePassword)) {
    throw new InvalidCredentialsError();
  }

  // TODO: should we check if the user exists?

  return {
    email: tokenData.sub.email,
    issuedAt: tokenData.iat,
    expires: tokenData.exp,
  };
};

export default getChangePasswordTokenData;
