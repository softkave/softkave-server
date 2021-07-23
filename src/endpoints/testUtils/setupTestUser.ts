import argon2 from "argon2";
import moment from "moment";
import { ClientType } from "../../models/system";
import { IClient } from "../../mongo/client";
import { IToken } from "../../mongo/token";
import { IUser } from "../../mongo/user";
import { getDateString } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { IBaseContext } from "../contexts/BaseContext";
import {
    CURRENT_USER_TOKEN_VERSION,
    IBaseTokenData,
} from "../contexts/TokenContext";
import { JWTEndpoint } from "../types";
import { testData } from "./data";

export interface ISetupTestUserResult {
    user: IUser;
    client: IClient;
    token: IToken;
    incomingTokenData: IBaseTokenData;
    context: IBaseContext;
}

let prevResult: ISetupTestUserResult | null = null;

export async function setupTestUser(
    context: IBaseContext
): Promise<ISetupTestUserResult> {
    if (prevResult) {
        console.log("using prev result");
        return prevResult;
    }

    const inputUser: Omit<IUser, "customId"> = {
        name: testData.testUser00.name,
        email: testData.testUser00.email,
        hash: await argon2.hash(testData.testUser00.password),
        createdAt: getDateString(),
        forganizationotPasswordHistory: [],
        passwordLastChangedAt: "",
        rootBlockId: "",
        organizations: [],
        color: testData.testUser00.color,
        notificationsLastCheckedAt: "",
    };

    const user = await context.user.saveUser(context, inputUser);

    let client: IClient = {
        clientId: getNewId(),
        createdAt: getDateString(),
        clientType: ClientType.Browser,
        users: [],
        endpoint: "",
        keys: {
            p256dh: "",
            auth: "",
        },
        pushSubscribedAt: "",
    };

    client = await context.client.saveClient(context, client);

    let token: IToken = {
        customId: getNewId(),
        userId: user.customId,
        version: CURRENT_USER_TOKEN_VERSION,
        issuedAt: getDateString(),
        audience: [JWTEndpoint.Login],
        expires: 0,
        meta: {},
        clientId: client.clientId,
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

    await context.client.updateClientById(context, client.clientId, {
        users: [
            {
                userId: user.customId,
                tokenId: token.customId,
                isLoggedIn: true,
            },
        ],
    });

    const result: ISetupTestUserResult = {
        context,
        user,
        client,
        token,
        incomingTokenData,
    };

    prevResult = result;
    return result;
}
