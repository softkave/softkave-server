import argon2 from "argon2";
import randomColor from "randomcolor";
import uuid from "uuid/v4";
import { ClientType } from "../../../models/system";
import { BlockType } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { getDate, getDateString } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { clientToClientUserView } from "../../client/utils";
import { IBaseContext } from "../../contexts/BaseContext";
import { CURRENT_USER_TOKEN_VERSION } from "../../contexts/TokenContext";
import { JWTEndpoint } from "../../types";
import { EmailAddressNotAvailableError } from "../errors";
import { IUserRootBlock } from "../types";
import { getPublicUserData } from "../utils";
import { SignupEndpoint } from "./types";
import { newUserInputSchema } from "./validation";

async function createRootBlock(context: IBaseContext, user: IUser) {
    const newRootBlock: Omit<IUserRootBlock, "customId"> = {
        name: `root_${user.customId}`,
        color: randomColor(),
        type: BlockType.Root,
        createdAt: getDate(),
        createdBy: user.customId,
    };

    // TODO: check if root block exists
    const rootBlock = await context.block.saveBlock(context, newRootBlock);

    // TODO: should we remove the user if the root block fails?
    user = await context.user.updateUserById(context, user.customId, {
        rootBlockId: rootBlock.customId,
    });

    return user;
}

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
        forganizationotPasswordHistory: [],
        passwordLastChangedAt: now,
        rootBlockId: "",
        orgs: [],
    };

    let user = await context.user.saveUser(context, value);
    user = await createRootBlock(context, user);
    instData.user = user;

    let client =
        (await context.session.tryGetClient(context, instData)) ||
        (await context.client.saveClient(context, {
            clientId: getNewId(),
            createdAt: getDateString(),
            clientType: ClientType.Browser,
            users: [],
        }));

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

export default signup;
