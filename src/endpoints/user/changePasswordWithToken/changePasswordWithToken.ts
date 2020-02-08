import { userEndpoints } from "../constants";
import { InvalidCredentialsError } from "../errors";
import UserToken from "../UserToken";
import { IChangePasswordWithTokenContext } from "./types";

async function changePasswordWithToken(
  context: IChangePasswordWithTokenContext
) {
  const tokenData = context.getRequestToken();

  if (!UserToken.containsAudience(tokenData, userEndpoints.changePassword)) {
    throw new InvalidCredentialsError();
  }

  return context.changePassword(context.data.password);
}

export default changePasswordWithToken;
