import argon2 from "argon2";
import { IClient } from "../../mongo/client";
import { IToken } from "../../mongo/token";
import { IUser } from "../../mongo/user";
import { getDateString } from "../../utilities/fns";
import { IBaseContext } from "../contexts/BaseContext";
import { IBaseTokenData } from "../contexts/TokenContext";
import { testData } from "./data";
import { setupTestClient } from "./setupTestClient";
import { setupTestToken } from "./setupTestToken";

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
        console.log("using prev setupUser result");
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

    prevResult = result;
    return result;
}
