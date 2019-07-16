import UserModel from "../../mongo/user/UserModel";
import jwtConstants from "../../utils/jwtConstants";
import newToken from "./newToken";
import sendChangePasswordEmail from "./sendChangePasswordEmail";
import userError from "./userError";
import { addEntryToPasswordDateLog } from "./utils";
import { validateEmail } from "./validation";

const linkExpirationDuration = "1 day";

export interface IForgotPasswordParameters {
  email: string;
  userModel: UserModel;
}

async function forgotPassword({ email, userModel }: IForgotPasswordParameters) {
  const emailValue = validateEmail(email);
  const user = await userModel.model
    .findOne({
      email: emailValue
    })
    .exec();

  if (!user) {
    throw userError.userDoesNotExist;
  }

  const expirationDuration = linkExpirationDuration;
  const token = newToken(user, {
    domain: jwtConstants.domains.changePassword,
    expiresIn: expirationDuration
  });

  await sendChangePasswordEmail({
    emailAddress: user.email,
    query: { t: token },
    expiration: expirationDuration
  });

  user.forgotPasswordHistory = addEntryToPasswordDateLog(
    user.forgotPasswordHistory
  );

  user.save();
}

export default forgotPassword;
