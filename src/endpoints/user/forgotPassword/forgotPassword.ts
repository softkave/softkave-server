import moment from "moment";
import { getDateString } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { CURRENT_USER_TOKEN_VERSION } from "../../contexts/TokenContext";
import { JWTEndpoint } from "../../types";
import { fireAndForgetPromise } from "../../utils";
import { UserDoesNotExistError } from "../errors";
import sendChangePasswordEmail from "../sendChangePasswordEmail";
import { addEntryToPasswordDateLog } from "../utils";
import { ForgotPasswordEndpoint } from "./types";
import { forgotPasswordJoiSchema } from "./validation";

const forgotPassword: ForgotPasswordEndpoint = async (context, instData) => {
  const result = validate(instData.data, forgotPasswordJoiSchema);
  const emailValue = result.email;
  let user = await context.user.getUserByEmail(context, emailValue);

  if (!user) {
    throw new UserDoesNotExistError({ field: "email" });
  }

  // TODO: Validate if user has reached threshold for changing password daily
  // TODO: Generate a change password token ID history

  const initTime = moment();

  // TODO: the expiration duration should be defined in a config file, not here
  const expiration = moment(initTime).add(2, "days");
  const tokenData = await context.token.saveToken(context, {
    // clientId: "", // TODO: get client id from request header or socket
    customId: getNewId(),
    audience: [JWTEndpoint.ChangePassword],
    issuedAt: getDateString(),
    userId: user.customId,
    version: CURRENT_USER_TOKEN_VERSION,
    expires: expiration.valueOf(),
  });

  const token = await context.token.encodeToken(
    context,
    tokenData.customId,
    tokenData.expires
  );

  await sendChangePasswordEmail(context, {
    expiration,
    emailAddress: user.email,
    query: { t: token },
  });

  const forgotPasswordHistory = addEntryToPasswordDateLog(
    user.forgotPasswordHistory
  );

  fireAndForgetPromise(
    context.user.updateUserById(context, user.customId, {
      forgotPasswordHistory,
    })
  );
};

export default forgotPassword;
