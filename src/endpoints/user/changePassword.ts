import argon2 from "argon2";

import newToken from "./newToken";
import { IUserDocument } from "./user";
import { addEntryToPasswordDateLog } from "./utils";
import { validatePassword } from "./validation";

export interface IChangePasswordParameters {
  password: string;
  user: IUserDocument;
}

async function changePassword({ password, user }: IChangePasswordParameters) {
  const passwordValue = validatePassword(password);
  user.hash = await argon2.hash(passwordValue);
  user.changePasswordHistory = addEntryToPasswordDateLog(
    user.changePasswordHistory
  );

  await user.save();
  return {
    user,
    token: newToken(user)
  };
}

export default changePassword;
