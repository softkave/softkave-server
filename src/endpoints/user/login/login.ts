import argon2 from "argon2";
import { ServerError } from "../../../utilities/errors";
import { validate } from "../../../utilities/joiUtils";
import logger from "../../../utilities/logger";
import { userEndpoints } from "../constants";
import { InvalidEmailOrPasswordError } from "../errors";
import UserToken from "../UserToken";
import { ILoginContext, ILoginResult } from "./types";
import { loginJoiSchema } from "./validation";

async function login(context: ILoginContext): Promise<ILoginResult> {
  const loginDetails = validate(context.data, loginJoiSchema);
  const userData = await context.getUserByEmail(loginDetails.email);

  if (userData) {
    try {
      await argon2.verify(userData.hash, loginDetails.password);
    } catch (error) {
      logger.error(error);

      // TODO: find a better error type for this error
      throw new ServerError();
    }
  } else {
    throw new InvalidEmailOrPasswordError();
  }

  return {
    user: userData,
    token: UserToken.newToken({
      user: userData,
      audience: [userEndpoints.login],
    }),
  };
}

export default login;
