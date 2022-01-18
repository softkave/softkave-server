import moment from "moment";
import { IClient } from "../../mongo/client";
import { IToken } from "../../mongo/token";
import { IUser } from "../../mongo/user";
import { getDateString } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { IBaseContext } from "../contexts/IBaseContext";
import {
    CURRENT_USER_TOKEN_VERSION,
    IBaseTokenData,
} from "../contexts/TokenContext";
import { JWTEndpoint } from "../types";

export interface ISetupTestTokenResult {
    token: IToken;
    incomingTokenData: IBaseTokenData;
    context: IBaseContext;
}

export interface ISetupTestTokenProps {
    client: IClient;
    user: IUser;
}

export async function setupTestToken(
    context: IBaseContext,
    props: ISetupTestTokenProps
): Promise<ISetupTestTokenResult> {
    let token: IToken = {
        customId: getNewId(),
        userId: props.user.customId,
        version: CURRENT_USER_TOKEN_VERSION,
        issuedAt: getDateString(),
        audience: [JWTEndpoint.Login],
        expires: 0,
        meta: {},
        clientId: props.client.clientId,
    };

    token = await context.token.saveToken(context, token);

    const incomingTokenData: IBaseTokenData = {
        version: token.version,
        sub: {
            id: token.customId,
        },
        iat: moment(token.issuedAt).valueOf() / 1000,
        exp: token.expires ? token.expires / 1000 : undefined,
    };

    await context.client.updateClientById(context, props.client.clientId, {
        users: [
            {
                userId: props.user.customId,
                tokenId: token.customId,
                isLoggedIn: true,
            },
        ],
    });

    const result: ISetupTestTokenResult = {
        context,
        token,
        incomingTokenData,
    };

    return result;
}
