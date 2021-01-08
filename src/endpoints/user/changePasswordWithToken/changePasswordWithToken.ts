import moment from "moment";
import { JWTEndpoints } from "../../types";
import {
    CredentialsExpiredError,
    InvalidCredentialsError,
    UserDoesNotExistError,
} from "../errors";
import UserToken from "../UserToken";
import { ChangePasswordWithTokenEndpoint } from "./types";

const changePasswordWithToken: ChangePasswordWithTokenEndpoint = async (
    context,
    instData
) => {
    const tokenData = context.session.getRequestToken(context, instData);

    if (
        !UserToken.containsAudience(
            tokenData,
            JWTEndpoints.ChangePassword,
            false
        )
    ) {
        throw new InvalidCredentialsError();
    }

    if (Date.now() > tokenData.exp * 1000) {
        throw new CredentialsExpiredError();
    }

    const user = await context.user.getUserByEmail(
        context,
        tokenData.sub.email
    );

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
