import argon2 from "argon2";
import Joi from "joi";

import UserModel from "../../mongo/user/UserModel";
import { validate } from "../../utils/joi-utils";
import newToken from "./newToken";
import userError from "./userError";
import { emailSchema, passwordSchema } from "./validation";

export interface ILoginParameters {
  email: string;
  password: string;
  userModel: UserModel;
}

const loginJoiSchema = Joi.object().keys({
  email: emailSchema,
  password: passwordSchema
});

async function login({ email, password, userModel }: ILoginParameters) {
  const result = validate({ email, password }, loginJoiSchema);
  email = result.email;
  password = result.password;

  const userData = await userModel.model
    .findOne({
      email
    })
    .lean()
    .exec();

  if (!userData || !(await argon2.verify(userData.hash, password))) {
    throw userError.invalidLoginCredentials;
  }

  return {
    user: userData,
    token: newToken(userData)
  };
}

export default login;
