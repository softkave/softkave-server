import argon2 from "argon2";

import UserModel from "../../mongo/user/UserModel";
import newToken from "./newToken";
import userError from "./userError";
import { validateEmail, validatePassword } from "./validation";

export interface ILoginParameters {
  email: string;
  password: string;
  userModel: UserModel;
}

async function login({ email, password, userModel }: ILoginParameters) {
  email = validateEmail(email);
  password = validatePassword(password);

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
