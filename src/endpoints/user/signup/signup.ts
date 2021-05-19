import argon2 from "argon2";
import uuid from "uuid/v4";
import {
    ClientType,
    SystemActionType,
    SystemResourceType,
} from "../../../models/system";
import { IUser } from "../../../mongo/user";
import { getDateString } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { clientToClientUserView } from "../../client/utils";
import { CURRENT_USER_TOKEN_VERSION } from "../../contexts/TokenContext";
import { JWTEndpoint } from "../../types";
import { EmailAddressNotAvailableError } from "../errors";
import { getPublicUserData } from "../utils";
import { SignupEndpoint } from "./types";
import { newUserInputSchema } from "./validation";

const signup: SignupEndpoint = async (context, instData) => {
    const data = validate(instData.data.user, newUserInputSchema);
    const userExists = await context.user.userExists(context, data.email);

    if (userExists) {
        throw new EmailAddressNotAvailableError({ field: "email" });
    }

    const hash = await argon2.hash(data.password);
    const now = getDateString();
    const value: IUser = {
        hash,
        customId: uuid(),
        email: data.email.toLowerCase(),
        name: data.name,
        color: data.color,
        createdAt: now,
        forgotPasswordHistory: [],
        passwordLastChangedAt: now,
        rootBlockId: "",
        orgs: [],
    };

    const user = await context.user.saveUser(context, value);
    instData.user = user;
    await context.createUserRootBlock(context, { ...instData, data: { user } });

    context.auditLog.insert(context, instData, {
        action: SystemActionType.Signup,
        resourceId: user.customId,
        resourceType: SystemResourceType.User,
    });

    let client =
        (await context.session.tryGetClient(context, instData)) ||
        clientToClientUserView(
            await context.client.saveClient(context, {
                clientId: getNewId(),
                createdAt: getDateString(),
                clientType: ClientType.Browser,
                users: [],
            }),
            user.customId
        );

    instData.client = client;
    const tokenData = await context.token.saveToken(context, {
        clientId: client.clientId,
        customId: getNewId(),
        audience: [JWTEndpoint.Login],
        issuedAt: getDateString(),
        userId: user.customId,
        version: CURRENT_USER_TOKEN_VERSION,
    });

    instData.tokenData = tokenData;
    client = clientToClientUserView(
        await context.client.updateUserEntry(
            context,
            instData,
            client.clientId,
            user.customId,
            {
                userId: user.customId,
                tokenId: tokenData.customId,
                isLoggedIn: true,
            }
        ),
        user.customId
    );

    instData.client = client;
    const token = context.token.encodeToken(context, tokenData.customId);

    return {
        token,
        user: getPublicUserData(user),
        client: client,
    };
};

export default signup;
