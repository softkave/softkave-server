import argon2 from "argon2";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { JWTEndpoints } from "../../types";
import UserToken from "../UserToken";
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
        passwordLastChangedAt: getDate(),
    });

    return {
        user: getPublicUserData(user),
        clientId: getNewId(),
        token: UserToken.newToken({
            user,
            audience: [JWTEndpoints.Login],
        }),
    };
};

export default changePassword;
