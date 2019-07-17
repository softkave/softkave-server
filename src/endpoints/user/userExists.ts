import UserModel from "../../mongo/user/UserModel";
import { validateEmail } from "./validation";

export interface IUserExistsParameters {
  email: string;
  userModel: UserModel;
}

async function userExists({ email, userModel }: IUserExistsParameters) {
  const value = validateEmail(email);
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
