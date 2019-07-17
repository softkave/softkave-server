import UserModel from "../../mongo/user/UserModel";
import { IUserDocument } from "./user";
import userError from "./userError";
import { validateUpdateUserData } from "./validation";

// TODO: define data's type
export interface IUpdateUserParameters {
  data: any;
  userModel: UserModel;
  user: IUserDocument;
}

async function updateUser({ data, userModel, user }: IUpdateUserParameters) {
  const userData = validateUpdateUserData(data);

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
