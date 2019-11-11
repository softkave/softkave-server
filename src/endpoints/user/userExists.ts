import Joi from "joi";

import UserModel from "../../mongo/user/UserModel";
import { validate } from "../../utils/joi-utils";
import { emailSchema, validateEmail } from "./validation";

export interface IUserExistsParameters {
  email: string;
  userModel: UserModel;
}

const userExistsJoiSchema = Joi.object().keys({
  email: emailSchema
});

async function userExists({ email, userModel }: IUserExistsParameters) {
  const result = validate({ email }, userExistsJoiSchema);
  const value = result.email.toLowerCase();
  const user = await userModel.model
    .findOne(
      {
        email: value
      },
      "customId",
      {
        lean: true
      }
    )
    .exec();

  return {
    userExists: !!user
  };
}

export default userExists;
