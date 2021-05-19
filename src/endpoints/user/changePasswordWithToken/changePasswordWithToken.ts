import { JWTEndpoint } from "../../types";
import { fireAndForgetPromise } from "../../utils";
import { CredentialsExpiredError, InvalidCredentialsError } from "../errors";
import { ChangePasswordWithTokenEndpoint } from "./types";

const changePasswordWithToken: ChangePasswordWithTokenEndpoint = async (
    context,
    instData
) => {
    const tokenData = await context.session.getTokenData(
        context,
        instData,
        JWTEndpoint.ChangePassword
    );

    if (
        !context.token.containsAudience(
            context,
            tokenData,
            JWTEndpoint.ChangePassword
        )
    ) {
        throw new InvalidCredentialsError();
    }

    const incomingTokenData = instData.incomingTokenData;

    if (Date.now() > incomingTokenData.exp * 1000) {
        throw new CredentialsExpiredError();
    }

    const user = await context.user.assertGetUserById(
        context,
        tokenData.userId
    );

    instData.user = user;
    const result = await context.changePassword(context, instData);

    fireAndForgetPromise(
        context.token.deleteTokenById(context, incomingTokenData.sub.id)
    );

    return result;
};

export default changePasswordWithToken;
