import argon2 from "argon2";
import { validate } from "../../../utils/joiUtils";
import { userEndpoints } from "../constants";
import { UserDoesNotExistError } from "../errors";
import UserToken from "../UserToken";
import { ILoginContext, ILoginResult } from "./types";
import { loginJoiSchema } from "./validation";

async function login(context: ILoginContext): Promise<ILoginResult> {
  validate(context.data, loginJoiSchema);

  const loginDetails = context.data;
  const userData = await context.getUserByEmail(loginDetails.email);

  if (userData) {
    await argon2.verify(userData.hash, loginDetails.password);
  } else {
    throw new UserDoesNotExistError();
  }

  return {
    user: userData,
    token: UserToken.newToken({
      user: userData,
      audience: [userEndpoints.login]
    })
  };
}

export default login;
