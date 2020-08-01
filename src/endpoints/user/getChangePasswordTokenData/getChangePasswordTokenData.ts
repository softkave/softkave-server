import { getDateString } from "../../../utilities/fns";
import { JWTEndpoints } from "../../utils";
import { InvalidCredentialsError } from "../errors";
import UserToken from "../UserToken";
import { GetChangePasswordTokenDataEndpoint } from "./types";

const getChangePasswordTokenData: GetChangePasswordTokenDataEndpoint = async (
  context,
  instData
) => {
  const tokenData = context.session.getRequestToken(context, instData);

  if (!UserToken.containsAudience(tokenData, JWTEndpoints.ChangePassword)) {
    throw new InvalidCredentialsError();
  }

  // TODO: should we check if the user exists?

  return {
    email: tokenData.sub.email,
    issuedAt: getDateString(tokenData.iat),
    expires: getDateString(tokenData.exp),
  };
};

export default getChangePasswordTokenData;
