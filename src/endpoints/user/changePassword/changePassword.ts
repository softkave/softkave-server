import argon2 from "argon2";
import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { getPublicClientData } from "../../client/utils";
import { JWTEndpoints } from "../../types";
import { getPublicUserData } from "../utils";
import { ChangePasswordEndpoint } from "./types";
import { changePasswordJoiSchema } from "./validation";

const changePassword: ChangePasswordEndpoint = async (context, instData) => {
    const result = validate(instData.data, changePasswordJoiSchema);
    const passwordValue = result.password;
    const user = await context.session.getUser(context, instData);
    const hash = await argon2.hash(passwordValue);

    await context.session.updateUser(context, instData, {
        hash,
        passwordLastChangedAt: getDateString(),
    });

    context.socket.disconnectUser(user.customId);
    context.session.clearCachedUserData(context, instData);

    const client = await context.client.getClientByUserId(
        context,
        user.customId
    );

    return {
        user: getPublicUserData(user),
        token: await context.userToken.getUserToken(context, instData, {
            user: user,
            audience: [JWTEndpoints.Login],
        }),
        client: getPublicClientData(client),
    };
};

export default changePassword;
