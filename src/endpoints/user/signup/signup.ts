import argon2 from "argon2";
import uuid from "uuid/v4";
import { validate } from "../../../utils/joiUtils";
import { userEndpoints } from "../constants";
import { EmailAddressNotAvailableError } from "../errors";
import UserToken from "../UserToken";
import { INewUser, ISignupContext, ISignupResult } from "./types";
import { newUserInputSchema } from "./validation";

async function signup(context: ISignupContext): Promise<ISignupResult> {
  validate(context.data, newUserInputSchema);
  const newUserInput = context.data;
  const userExists = await context.userExists(newUserInput.email);

  if (userExists) {
    throw new EmailAddressNotAvailableError({ field: "email" });
  }

  const hash = await argon2.hash(newUserInput.password);
  const value: INewUser = {
    hash,
    customId: uuid(),
    email: newUserInput.email.toLowerCase(),
    name: newUserInput.name,
    color: newUserInput.color
  };

  const user = await context.saveUser(value);
  await context.createUserRootBlock(user);

  return {
    user,
    token: UserToken.newToken({ user, audience: [userEndpoints.login] })
  };
}

export default signup;
