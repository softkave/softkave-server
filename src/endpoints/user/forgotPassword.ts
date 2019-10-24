import Joi from "joi";

import UserModel from "../../mongo/user/UserModel";
import { validate } from "../../utils/joi-utils";
import jwtConstants from "../../utils/jwtConstants";
import newToken from "./newToken";
import sendChangePasswordEmail from "./sendChangePasswordEmail";
import userError from "./userError";
import { addEntryToPasswordDateLog } from "./utils";
import { emailSchema } from "./validation";

const linkExpirationDuration = "2d";
const linkExpirationDurationMs = Date.now() + 2 * 24 * 60 * 60 * 1000;

export interface IForgotPasswordParameters {
  email: string;
  userModel: UserModel;
}

const forgotPasswordJoiSchema = Joi.object().keys({
  email: emailSchema
});

async function forgotPassword({ email, userModel }: IForgotPasswordParameters) {
  const result = validate({ email }, forgotPasswordJoiSchema);
  const emailValue = result.email;
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
    expiration: linkExpirationDurationMs
  });

  user.forgotPasswordHistory = addEntryToPasswordDateLog(
    user.forgotPasswordHistory
  );

  user.save();
}

export default forgotPassword;
