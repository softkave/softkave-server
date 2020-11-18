import argon2 from "argon2";
import uuid from "uuid/v4";
import {
    AuditLogActionType,
    AuditLogResourceType,
} from "../../../mongo/audit-log";
import { IUser } from "../../../mongo/user";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { JWTEndpoints } from "../../types";
import { EmailAddressNotAvailableError } from "../errors";
import UserToken from "../UserToken";
import { getPublicUserData } from "../utils";
import { SignupEndpoint } from "./types";
import { newUserInputSchema } from "./validation";

const signup: SignupEndpoint = async (context, instData) => {
    const data = validate(instData.data.user, newUserInputSchema);
    const userExists = await context.userExists(context, {
        ...instData,
        data: { email: data.email },
    });

    if (userExists) {
        throw new EmailAddressNotAvailableError({ field: "email" });
    }

    const hash = await argon2.hash(data.password);
    const now = getDate();
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
    context.session.addUserToSession(context, instData, user);
    await context.createUserRootBlock(context, { ...instData, data: { user } });

    context.auditLog.insert(context, instData, {
        action: AuditLogActionType.Signup,
        resourceId: user.customId,
        resourceType: AuditLogResourceType.User,
    });

    return {
        user: getPublicUserData(user),
        token: UserToken.newToken({
            user,
            audience: [JWTEndpoints.Login],
            clientId: getNewId(),
        }),
    };
};

export default signup;
