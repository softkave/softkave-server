import argon2 from "argon2";
import { getDateString } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { CURRENT_USER_TOKEN_VERSION } from "../../contexts/TokenContext";
import { JWTEndpoint } from "../../types";
import { fireAndForgetPromise } from "../../utils";
import { getPublicUserData } from "../utils";
import { ChangePasswordEndpoint } from "./types";
import { changePasswordJoiSchema } from "./validation";

const changePassword: ChangePasswordEndpoint = async (context, instData) => {
    const result = validate(instData.data, changePasswordJoiSchema);
    const newPassword = result.password;
    let user = await context.session.getUser(context, instData);
    const client = await context.session.getClient(context, instData);
    const hash = await argon2.hash(newPassword);

    user = await context.user.updateUserById(context, user.customId, {
        hash,
        passwordLastChangedAt: getDateString(),
    });

    instData.user = user;
    context.socket.disconnectUser(user.customId);

    delete instData.tokenData;
    delete instData.incomingTokenData;

    fireAndForgetPromise(
        context.token.deleteTokensByUserId(context, user.customId)
    );

    const tokenData = await context.token.saveToken(context, {
        clientId: client.clientId,
        customId: getNewId(),
        audience: [JWTEndpoint.Login],
        issuedAt: getDateString(),
        userId: user.customId,
        version: CURRENT_USER_TOKEN_VERSION,
    });

    instData.tokenData = tokenData;
    const token = context.token.encodeToken(context, tokenData.customId);

    return {
        token,
        client,
        user: getPublicUserData(user),
    };
};

export default changePassword;
