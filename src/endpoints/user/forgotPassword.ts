import Joi from "joi";
import moment from "moment";
import UserModel from "../../mongo/user/UserModel";
import { validate } from "../../utils/joi-utils";
import jwtConstants from "../../utils/jwtConstants";
import newToken, { IBaseTokenData } from "./newToken";
import sendChangePasswordEmail from "./sendChangePasswordEmail";
import userError from "./userError";
import { addEntryToPasswordDateLog } from "./utils";
import { emailSchema } from "./validation";

export interface IChangePasswordTokenData extends IBaseTokenData {
  exp: number;
}

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

  // TODO: Validate if user has reached threshold for changing password daily
  // TODO: Generate a change password token ID history
  // TODO: Or alternatively, instead of sending links to user emails, send a uuid code
  // corresponding to stored credentials in db

  const defaultExpirationDurationInDays = 2;
  const days = "days";
  const initTime = moment();
  const expiration = moment(initTime).add(
    defaultExpirationDurationInDays,
    days
  );

  const token = newToken(user, {
    domain: jwtConstants.domains.changePassword,
    expiresIn: `${defaultExpirationDurationInDays} ${days}`
  });

  await sendChangePasswordEmail({
    expiration,
    emailAddress: user.email,
    query: { t: token }
  });

  user.forgotPasswordHistory = addEntryToPasswordDateLog(
    user.forgotPasswordHistory
  );

  user.save();
}

export default forgotPassword;
