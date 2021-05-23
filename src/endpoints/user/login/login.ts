import argon2 from "argon2";
import { ServerError } from "../../../utilities/errors";
import { validate } from "../../../utilities/joiUtils";
import { JWTEndpoint } from "../../types";
import { InvalidEmailOrPasswordError } from "../errors";
import { getPublicUserData } from "../utils";
import { LoginEndpoint } from "./types";
import { loginJoiSchema } from "./validation";
import { clientToClientUserView } from "../../client/utils";
import getNewId from "../../../utilities/getNewId";
import { getDateString } from "../../../utilities/fns";
import { ClientType } from "../../../models/system";
import { CURRENT_USER_TOKEN_VERSION } from "../../contexts/TokenContext";

const login: LoginEndpoint = async (context, instData) => {
    const loginDetails = validate(instData.data, loginJoiSchema);
    const user = await context.user.getUserByEmail(context, loginDetails.email);

    if (!user) {
        throw new InvalidEmailOrPasswordError();
    }

    let passwordMatch = false;

    try {
        passwordMatch = await argon2.verify(user.hash, loginDetails.password);
    } catch (error) {
        console.error(error);
        throw new ServerError();
    }

    if (!passwordMatch) {
        throw new InvalidEmailOrPasswordError();
    }

    let client = await context.session.tryGetClient(context, instData);

    if (!client) {
        client = await context.client.saveClient(context, {
            clientId: getNewId(),
            createdAt: getDateString(),
            clientType: ClientType.Browser,
            users: [],
        });
    }

    instData.client = client;
    const tokenData =
        (await context.token.getTokenByUserAndClientId(
            context,
            user.customId,
            client.clientId
        )) ||
        (await context.token.saveToken(context, {
            clientId: client.clientId,
            customId: getNewId(),
            audience: [JWTEndpoint.Login],
            issuedAt: getDateString(),
            userId: user.customId,
            version: CURRENT_USER_TOKEN_VERSION,
        }));

    instData.tokenData = tokenData;
    client = await context.client.updateUserEntry(
        context,
        instData,
        client.clientId,
        user.customId,
        {
            userId: user.customId,
            tokenId: tokenData.customId,
            isLoggedIn: true,
        }
    );

    instData.client = client;
    const token = context.token.encodeToken(context, tokenData.customId);

    return {
        token,
        user: getPublicUserData(user),
        client: clientToClientUserView(instData.client, user.customId),
    };
};

export default login;
