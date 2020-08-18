import moment = require("moment");
import getId from "../../../utilities/getId";
import { validate } from "../../../utilities/joiUtils";
import { JWTEndpoints } from "../../utils";
import { UserDoesNotExistError } from "../errors";
import UserToken from "../UserToken";
import { addEntryToPasswordDateLog } from "../utils";
import { ForgotPasswordEndpoint } from "./types";
import { forgotPasswordJoiSchema } from "./validation";

const forgotPassword: ForgotPasswordEndpoint = async (context, instData) => {
  const result = validate(instData.data, forgotPasswordJoiSchema);
  const emailValue = result.email;
  const user = await context.user.getUserByEmail(context, emailValue);

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
    audience: [JWTEndpoints.ChangePassword],
    expires: expiration.valueOf(),
    clientId: getId(), // TODO: not used for changing password, how can we make it better?
  });

  await context.sendChangePasswordEmail({
    expiration,
    emailAddress: user.email,
    query: { t: token },
  });

  const forgotPasswordHistory = addEntryToPasswordDateLog(
    user.forgotPasswordHistory
  );

  context.session
    .updateUser(context, instData, { forgotPasswordHistory })
    .catch(() => {
      // TODO: should we log something here?
      // Fire and forget
    });
};

export default forgotPassword;
