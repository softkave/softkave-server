import argon2 from "argon2";
import { validate } from "utils/joiUtils";
import { userEndpoints } from "../constants";
import UserToken from "../UserToken";
import { addEntryToPasswordDateLog } from "../utils";
import { IChangePasswordContext } from "./types";
import { changePasswordJoiSchema } from "./validation";

async function changePassword(context: IChangePasswordContext) {
  const result = validate(context.data, changePasswordJoiSchema);
  const passwordValue = result.password;
  const user = await context.getUser();
  user.hash = await argon2.hash(passwordValue);
  user.changePasswordHistory = addEntryToPasswordDateLog(
    user.changePasswordHistory
  );

  await context.saveUserPasswordHash(user.hash);

  return {
    user,
    token: UserToken.newToken({ user, audience: [userEndpoints.login] })
  };
}

export default changePassword;
