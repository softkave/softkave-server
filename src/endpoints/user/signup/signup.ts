import argon2 from "argon2";
import uuid from "uuid/v4";
import { SystemActionType, SystemResourceType } from "../../../models/system";
import { IUser } from "../../../mongo/user";
import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { getPublicClientData } from "../../client/utils";
import { JWTEndpoints } from "../../types";
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

    return {
        user: getPublicUserData(user),
        token: await context.userToken.newUserToken(context, instData, {
            audience: [JWTEndpoints.Login],
        }),
        client: getPublicClientData(instData.client),
    };
};

export default signup;
