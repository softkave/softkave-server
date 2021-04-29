import moment from "moment";
import { JWTEndpoints } from "../../types";
import {
    CredentialsExpiredError,
    InvalidCredentialsError,
    UserDoesNotExistError,
} from "../errors";
import { ChangePasswordWithTokenEndpoint } from "./types";

const changePasswordWithToken: ChangePasswordWithTokenEndpoint = async (
    context,
    instData
) => {
    const tokenData = context.session.getRequestToken(context, instData);

    if (
        !context.userToken.containsAudience(
            context,
            tokenData,
            JWTEndpoints.ChangePassword
        )
    ) {
        throw new InvalidCredentialsError();
    }

    if (Date.now() > tokenData.exp * 1000) {
        throw new CredentialsExpiredError();
    }

    // TODO: centralize token checks
    if (!tokenData.userId) {
        throw new InvalidCredentialsError();
    }

    const user = await context.user.getUserByEmail(context, tokenData.userId);

    if (!user) {
        throw new UserDoesNotExistError();
    }

    if (
        user.passwordLastChangedAt &&
        moment(user.passwordLastChangedAt).isAfter(moment(tokenData.iat * 1000))
    ) {
        throw new CredentialsExpiredError();
    }

    context.session.addUserToSession(context, instData, user);
    return context.changePassword(context, instData);
};

export default changePasswordWithToken;
