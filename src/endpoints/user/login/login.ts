import argon2 from "argon2";
import Joi from "joi";
import { ILoginContext, ILoginResult } from "./types";
import { validate } from "../../../utils/joiUtils";
import { loginJoiSchema } from "./validation";
import { InvalidCredentialsError } from "../errors";
import newToken from "../newToken";

async function login(context: ILoginContext): Promise<ILoginResult> {
  validate(context.data, loginJoiSchema);
  const loginDetails = context.data;
  const userExists = await context.userExists(loginDetails.email);

  let userData;
  if (userExists) {
    const email = loginDetails.email;
    userData = await loginDetails.userModel.model
      .findOne({
        email
      })
      .lean()
      .exec();

    await argon2.verify(userData.hash, loginDetails.password);
  } else {
    throw new InvalidCredentialsError({ field: "email" });
  }

  return {
    user: userData,
    // i don't know if this is the right implementation of this return
    token: newToken(userData)
  };
}

export default login;
