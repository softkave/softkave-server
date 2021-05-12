import argon2 from "argon2";
import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { getPublicClientData } from "../../client/utils";
import { JWTEndpoints } from "../../types";
import { fireAndForgetPromise } from "../../utils";
import { getPublicUserData } from "../utils";
import { ChangePasswordEndpoint } from "./types";
import { changePasswordJoiSchema } from "./validation";

const changePassword: ChangePasswordEndpoint = async (context, instData) => {
    const result = validate(instData.data, changePasswordJoiSchema);
    const passwordValue = result.password;
    let user = await context.session.getUser(context, instData);
    const hash = await argon2.hash(passwordValue);

    user = await context.user.updateUserById(context, user.customId, {
        hash,
        passwordLastChangedAt: getDateString(),
    });

    context.socket.disconnectUser(user.customId);
    instData.user = user;
    delete instData.tokenData;
    delete instData.incomingTokenData;

    fireAndForgetPromise(
        context.token.deleteTokensByUserId(context, user.customId)
    );

    const token = await context.userToken.newUserToken(context, instData, {
        audience: [JWTEndpoints.Login],
    });

    return {
        token,
        user: getPublicUserData(user),
        client: getPublicClientData(instData.client),
    };
};

export default changePassword;
