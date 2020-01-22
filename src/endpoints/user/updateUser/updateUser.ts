import argon2 from "argon2";
import { validate } from "../../../utils/joiUtils";
import { userEndpoints } from "../constants";
import { UserDoesNotExistError } from "../errors";
import UserToken from "../UserToken";
import { IUpdateUserContext, IUpdateUserResult } from "./types";
import { loginJoiSchema } from "./validation";

async function login(context: IUpdateUserContext): Promise<IUpdateUserResult> {
  const loginDetails = validate(context.data, loginJoiSchema);
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

  const result = validate({ data }, updateUserJoiSchema);
  const userData = result.data;

  const updatedUser = userModel.model
    .findOneAndUpdate(
      {
        customId: user.customId
      },
      userData,
      {
        fields: "customId"
      }
    )
    .lean()
    .exec();

  if (!!!updatedUser) {
    throw userError.userDoesNotExist;
  }
}

export default login;
