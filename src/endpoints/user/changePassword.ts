import argon2 from "argon2";
import Joi from "joi";

import { validate } from "../../utils/joi-utils";
import newToken from "./newToken";
import { IUserDocument } from "./user";
import { addEntryToPasswordDateLog } from "./utils";
import { passwordSchema, validatePassword } from "./validation";

export interface IChangePasswordParameters {
  password: string;
  user: IUserDocument;
}

const changePasswordJoiSchema = Joi.object().keys({
  password: passwordSchema
});

async function changePassword({ password, user }: IChangePasswordParameters) {
  const result = validate({ password }, changePasswordJoiSchema);
  const passwordValue = result.passwordValue;
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
