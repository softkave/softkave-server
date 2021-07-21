import moment from "moment";
import { getDateString } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { CURRENT_USER_TOKEN_VERSION } from "../../contexts/TokenContext";
import { JWTEndpoint } from "../../types";
import { fireAndForganizationetPromise } from "../../utils";
import { UserDoesNotExistError } from "../errors";
import { addEntryToPasswordDateLog } from "../utils";
import { ForganizationotPasswordEndpoint } from "./types";
import { forganizationotPasswordJoiSchema } from "./validation";

const forganizationotPassword: ForganizationotPasswordEndpoint = async (
    context,
    instData
) => {
    const result = validate(instData.data, forganizationotPasswordJoiSchema);
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

    await context.sendChangePasswordEmail({
        expiration,
        emailAddress: user.email,
        query: { t: token },
    });

    const forganizationotPasswordHistory = addEntryToPasswordDateLog(
        user.forganizationotPasswordHistory
    );

    fireAndForganizationetPromise(
        context.user.updateUserById(context, user.customId, {
            forganizationotPasswordHistory,
        })
    );
};

export default forganizationotPassword;
