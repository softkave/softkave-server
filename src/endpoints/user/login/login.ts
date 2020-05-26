import argon2 from "argon2";
import { ServerError } from "../../../utilities/errors";
import { validate } from "../../../utilities/joiUtils";
import logger from "../../../utilities/logger";
import { userEndpoints } from "../constants";
import { InvalidEmailOrPasswordError } from "../errors";
import UserToken from "../UserToken";
import { getPublicUserData } from "../utils";
import { ILoginContext, ILoginResult } from "./types";
import { loginJoiSchema } from "./validation";

async function login(context: ILoginContext): Promise<ILoginResult> {
  const loginDetails = validate(context.data, loginJoiSchema);
  const userData = await context.getUserByEmail(loginDetails.email);

  if (userData) {
    try {
      const passwordMatch = await argon2.verify(
        userData.hash,
        loginDetails.password
      );

      if (passwordMatch) {
        return {
          user: getPublicUserData(userData),
          token: UserToken.newToken({
            user: userData,
            audience: [userEndpoints.login],
          }),
        };
      }
    } catch (error) {
      // logger.error(error);
      console.error(error);

      // TODO: find a better error type for this error
      throw new ServerError();
    }
  }

  throw new InvalidEmailOrPasswordError();
}

export default login;
