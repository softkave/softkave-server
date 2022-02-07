import argon2 from "argon2";
import { IClient } from "../../mongo/client";
import { IToken } from "../../mongo/token";
import { IUser } from "../../mongo/user";
import { getDateString } from "../../utilities/fns";
import { IBaseContext } from "../contexts/IBaseContext";
import { IBaseTokenData } from "../contexts/TokenContext";
import { chance, testData } from "./data/data";
import { setupTestClient } from "./setupTestClient";
import { setupTestToken } from "./setupTestToken";

export interface ISetupTestUserResult {
    user: IUser;
    client: IClient;
    token: IToken;
    incomingTokenData: IBaseTokenData;
    context: IBaseContext;
}

export async function setupTestUser(
    context: IBaseContext
): Promise<ISetupTestUserResult> {
    const inputUser: Omit<IUser, "customId"> = {
        name: chance.first(),
        email: chance.email(),
        hash: await argon2.hash(testData.testUser00.password),
        createdAt: getDateString(),
        forgotPasswordHistory: [],
        passwordLastChangedAt: "",
        rootBlockId: "",
        orgs: [],
        color: chance.color({ format: "hex" }),
        notificationsLastCheckedAt: "",
    };

    const user = await context.user.saveUser(context, inputUser);
    const { client } = await setupTestClient(context);
    const { token, incomingTokenData } = await setupTestToken(context, {
        user,
        client,
    });

    const result: ISetupTestUserResult = {
        context,
        user,
        client,
        token,
        incomingTokenData,
    };

    return result;
}
