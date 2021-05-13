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
            const token = await context.userToken.newUserToken(
                context,
                instData,
                {
                    audience: [JWTEndpoints.Login],
                }
            );

            // TODO: can we make this better?
            const client = await context.client.updateUserEntry(
                context,
                instData,
                instData.clientId,
                user.customId,
                { isLoggedIn: true }
            );

            instData.client = client;
            return {
                token,
                user: getPublicUserData(user),
                client: getPublicClientData(instData.client, user.customId),
            };
        }
    } catch (error) {
        console.error(error);

        // TODO: find a better error type for this error
        throw new ServerError();
    }
};

export default login;
