import moment = require("moment");
import { validate } from "../../../utils/joiUtils";
import { userEndpoints } from "../constants";
import { UserDoesNotExistError } from "../errors";
import UserToken from "../UserToken";
import { IForgotPasswordContext } from "./types";
import { forgotPasswordJoiSchema } from "./validation";

async function forgotPassword(context: IForgotPasswordContext) {
  const result = validate(context.data, forgotPasswordJoiSchema);
  const emailValue = result.email;
  const user = await context.getUserByEmail(emailValue);

  if (!user) {
    throw new UserDoesNotExistError({ field: "email" });
  }

  // TODO: Validate if user has reached threshold for changing password daily
  // TODO: Generate a change password token ID history
  // TODO: Or alternatively, instead of sending links to user emails, send a uuid code
  // corresponding to stored credentials in db

  const initTime = moment();

  // TODO: the expiration duration should be defined in a config file, not here
  const expiration = moment(initTime).add(2, "days");

  const token = UserToken.newToken({
    user,
    audience: [userEndpoints.changePassword],
    expires: expiration.valueOf()
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
