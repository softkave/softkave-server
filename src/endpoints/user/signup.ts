import argon2 from "argon2";
import Joi from "joi";
import uuid from "uuid/v4";

import BlockModel from "../../mongo/block/BlockModel";
import mongoDBConstants from "../../mongo/constants";
import UserModel from "../../mongo/user/UserModel";
import { validate } from "../../utils/joi-utils";
import OperationError from "../../utils/OperationError";
import serverError from "../../utils/serverError";
import createRootBlock from "../block/createRootBlock";
import { userFieldNames } from "./constants";
import newToken from "./newToken";
import { IUser } from "./user";
import { userErrorFields, userErrorMessages } from "./userError";
import userExists from "./userExists";
import { userSignupSchema, validateUserSignupData } from "./validation";

// TODO: define user's type
export interface ISignupParameters {
  user: any;
  userModel: UserModel;
  blockModel: BlockModel;
}

const signupJoiSchema = Joi.object().keys({
  user: userSignupSchema
});

async function signup({ user, userModel, blockModel }: ISignupParameters) {
  const result = validate({ user }, signupJoiSchema);
  const value = result.user;
  const userExistsResult = await userExists({ userModel, email: user.email });

  if (!!userExistsResult && userExistsResult.userExists) {
    throw new OperationError(
      userErrorFields.emailAddressNotAvailable,
      userErrorMessages.emailAddressNotAvailable,
      `user.${userFieldNames.email}`
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
      throw new OperationError(
        userErrorFields.emailAddressNotAvailable,
        userErrorMessages.emailAddressNotAvailable,
        `user.${userFieldNames.email}`
      );
    }

    // For debugging purposes
    console.error(error);
    throw serverError.serverError;
  }
}

export default signup;