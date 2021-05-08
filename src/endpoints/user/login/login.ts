import argon2 from "argon2";
import { ServerError } from "../../../utilities/errors";
import { validate } from "../../../utilities/joiUtils";
import { JWTEndpoints } from "../../types";
import { InvalidEmailOrPasswordError } from "../errors";
import { getPublicUserData } from "../utils";
import { LoginEndpoint } from "./types";
import { loginJoiSchema } from "./validation";
import { getPublicClientData } from "../../client/utils";

const login: LoginEndpoint = async (context, instData) => {
    const loginDetails = validate(instData.data, loginJoiSchema);
    const user = await context.user.getUserByEmail(context, loginDetails.email);

    if (!user) {
        throw new InvalidEmailOrPasswordError();
    }

    try {
        const passwordMatch = await argon2.verify(
            user.hash,
            loginDetails.password
        );

        if (passwordMatch) {
            return {
                user: getPublicUserData(user),
                token: await context.userToken.newUserToken(context, instData, {
                    audience: [JWTEndpoints.Login],
                }),
                client: getPublicClientData(instData.client),
            };
        }
    } catch (error) {
        console.error(error);

        // TODO: find a better error type for this error
        throw new ServerError();
    }
};

export default login;
