import Joi from "joi";

import UserModel from "../../mongo/user/UserModel";
import { validate } from "../../utils/joiUtils";
import { IUserDocument } from "./user";
import userError from "./userError";
import { updateUserSchema, validateUpdateUserData } from "./validation";

// TODO: define data's type
export interface IUpdateUserParameters {
  data: any;
  userModel: UserModel;
  user: IUserDocument;
}

const updateUserJoiSchema = Joi.object().keys({
  data: updateUserSchema
});

async function updateUser({ data, userModel, user }: IUpdateUserParameters) {
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

export default updateUser;
