import { JWTEndpoints } from "../../types";
import { fireAndForgetPromise } from "../../utils";
import { CredentialsExpiredError, InvalidCredentialsError } from "../errors";
import { ChangePasswordWithTokenEndpoint } from "./types";

const changePasswordWithToken: ChangePasswordWithTokenEndpoint = async (
    context,
    instData
) => {
    const tokenData = instData.incomingTokenData;

    if (
        !tokenData ||
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

    const token = await context.token.assertGetTokenById(
        context,
        tokenData.sub.id
    );

    if (!token.userId) {
        throw new InvalidCredentialsError();
    }

    const user = await context.user.assertGetUserById(context, token.userId);
    instData.user = user;

    const result = await context.changePassword(context, instData);

    // all tokens should've been deleted in changePassword
    // but we're doing this again, just in case
    fireAndForgetPromise(
        context.token.deleteTokenById(context, tokenData.sub.id)
    );

    return result;
};

export default changePasswordWithToken;
