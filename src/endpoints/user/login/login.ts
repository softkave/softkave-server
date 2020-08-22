import argon2 from "argon2";
import { ServerError } from "../../../utilities/errors";
import getId from "../../../utilities/getId";
import { validate } from "../../../utilities/joiUtils";
import logger from "../../../utilities/logger";
import { JWTEndpoints } from "../../utils";
import { InvalidEmailOrPasswordError } from "../errors";
import UserToken from "../UserToken";
import { getPublicUserData } from "../utils";
import { LoginEndpoint } from "./types";
import { loginJoiSchema } from "./validation";

const login: LoginEndpoint = async (context, instData) => {
  const loginDetails = validate(instData.data, loginJoiSchema);
  const userData = await context.user.getUserByEmail(
    context,
    loginDetails.email
  );

  if (userData) {
    try {
      const passwordMatch = await argon2.verify(
        userData.hash,
        loginDetails.password
      );

      if (passwordMatch) {
        return {
          clientId: getId(),
          user: getPublicUserData(userData),
          token: UserToken.newToken({
            user: userData,
            audience: [JWTEndpoints.Login],
          }),
        };
      }
    } catch (error) {
      console.error(error);
      // console.error(error);

      // TODO: find a better error type for this error
      throw new ServerError();
    }
  }

  throw new InvalidEmailOrPasswordError();
};

export default login;
