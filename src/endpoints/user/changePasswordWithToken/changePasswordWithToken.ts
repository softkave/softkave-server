import { userEndpoints } from "../constants";
import { InvalidCredentialsError, UserDoesNotExistError } from "../errors";
import UserToken from "../UserToken";
import { IChangePasswordWithTokenContext } from "./types";

async function changePasswordWithToken(
  context: IChangePasswordWithTokenContext
) {
  const tokenData = context.getRequestToken();

  if (!UserToken.containsAudience(tokenData, userEndpoints.changePassword)) {
    throw new InvalidCredentialsError();
  }

  const user = await context.getUserByEmail(tokenData.sub.email);

  if (!user) {
    throw new UserDoesNotExistError();
  }

  context.addUserToReq(user);

  return context.changePassword(context.data.password);
}

export default changePasswordWithToken;
