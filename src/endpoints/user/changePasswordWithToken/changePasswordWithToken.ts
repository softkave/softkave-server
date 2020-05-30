import { userJWTEndpoints } from "../constants";
import {
  CredentialsExpiredError,
  InvalidCredentialsError,
  UserDoesNotExistError,
} from "../errors";
import UserToken from "../UserToken";
import { ChangePasswordWithTokenEndpoint } from "./types";

const changePasswordWithToken: ChangePasswordWithTokenEndpoint = async (
  context,
  instData
) => {
  const tokenData = context.session.getRequestToken(context.models, instData);

  if (!UserToken.containsAudience(tokenData, userJWTEndpoints.changePassword)) {
    throw new InvalidCredentialsError();
  }

  if (Date.now() > tokenData.exp * 1000) {
    throw new CredentialsExpiredError();
  }

  const user = await context.user.getUserByEmail(
    context.models,
    tokenData.sub.email
  );

  if (!user) {
    throw new UserDoesNotExistError();
  }

  context.session.addUserToSession(context.models, instData, user);
  return context.changePassword(context, instData);
};

export default changePasswordWithToken;
