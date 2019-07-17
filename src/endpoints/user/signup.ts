import argon2 from "argon2";
import uuid from "uuid/v4";

import BlockModel from "../../mongo/block/BlockModel";
import mongoDBConstants from "../../mongo/constants";
import UserModel from "../../mongo/user/UserModel";
import RequestError from "../../utils/RequestError";
import serverError from "../../utils/serverError";
import createRootBlock from "../block/createRootBlock";
import { userFieldNames } from "./constants";
import newToken from "./newToken";
import { IUser } from "./user";
import { userErrorMessages } from "./userError";
import userExists from "./userExists";
import { validateUserSignupData } from "./validation";

// TODO: define user's type
export interface ISignupParameters {
  user: any;
  userModel: UserModel;
  blockModel: BlockModel;
}

async function signup({ user, userModel, blockModel }: ISignupParameters) {
  const value = validateUserSignupData(user);
  const userExistsResult = await userExists({ userModel, email: user.email });

  if (!!userExistsResult && userExistsResult.userExists) {
    throw new RequestError(
      userFieldNames.email,
      userErrorMessages.emailAddressNotAvailable
    );
  }

  try {
    value.hash = await argon2.hash(value.password);
    value.customId = uuid();
    delete value.password;
    let newUser = new userModel.model(value);
    newUser = await newUser.save();
    await createRootBlock({ blockModel, user: newUser });

    return {
      user: newUser,
      token: newToken(newUser)
    };
  } catch (error) {
    // Adding a user fails with code 11000 if unique fields in this case email exists
    if (error.code === mongoDBConstants.indexNotUniqueErrorCode) {
      throw new RequestError(
        userFieldNames.email,
        userErrorMessages.emailAddressNotAvailable
      );
    }

    // For debugging purposes
    console.error(error);
    throw serverError.serverError;
  }
}

export default signup;
