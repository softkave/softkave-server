import { IUser } from "../../mongo/user";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { indexArray } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { IUpdateItemById } from "../../utilities/types";
import { IBaseContext } from "../contexts/BaseContext";
import { IUserContext } from "../contexts/UserContext";
import { UserDoesNotExistError } from "../user/errors";

const users: IUser[] = [];

class TestUserContext implements IUserContext {
    getUserByEmail = async (ctx: IBaseContext, email: string) => {
        email = email.toLowerCase();
        return users.find((user) => user.email.toLowerCase() === email) || null;
    };

    bulkGetUsersByEmail = async (ctx: IBaseContext, emails: string[]) => {
        const emailMap = indexArray(emails, {
            indexer: (email) => email.toLowerCase(),
        });

        return users.filter((user) => emailMap[user.email.toLowerCase()]);
    };

    getUserById = async (ctx: IBaseContext, customId: string) => {
        return users.find((user) => user.customId === customId) || null;
    };

    assertGetUserById = async (ctx: IBaseContext, customId: string) => {
        const user = ctx.user.getUserById(ctx, customId);

        if (!user) {
            throw new UserDoesNotExistError();
        }

        return user;
    };

    updateUserById = async (
        ctx: IBaseContext,
        customId: string,
        data: Partial<IUser>
    ) => {
        const index = users.findIndex((user) => user.customId === customId);

        if (index === -1) {
            return null;
        }

        users[index] = { ...users[index], ...data };
        return users[index];
    };

    bulkGetUsersById = async (ctx: IBaseContext, ids: string[]) => {
        const usersMap = indexArray(users, { path: "customId" });
        const data: IUser[] = [];
        ids.forEach((id) => {
            if (usersMap[id]) {
                data.push(usersMap[id]);
            }
        });

        return data;
    };

    saveUser = async (ctx: IBaseContext, user: Omit<IUser, "customId">) => {
        users.push({
            ...user,
            customId: getNewId(),
        });

        return users[users.length - 1];
    };

    userExists = async (ctx: IBaseContext, email: string) => {
        return !!(await ctx.user.getUserByEmail(ctx, email));
    };

    getBlockCollaborators = async (ctx: IBaseContext, blockId: string) => {
        return users.filter((user) => {
            return (
                user.orgs &&
                user.orgs.findIndex(
                    (organization) => organization.customId === blockId
                ) !== -1
            );
        });
    };

    getOrganizationUsers = async (ctx: IBaseContext, blockId: string) => {
        return users.filter((user) => {
            return (
                user.orgs &&
                user.orgs.findIndex(
                    (organization) => organization.customId === blockId
                ) !== -1
            );
        });
    };

    bulkUpdateUsersById = async (
        ctx: IBaseContext,
        inputUsers: Array<IUpdateItemById<IUser>>
    ) => {
        const usersMap = indexArray(users, {
            path: "customId",
            reducer: (user, arr, index) => ({ user, index }),
        });

        inputUsers.forEach(({ id, data }) => {
            const userEntry = usersMap[id];

            if (userEntry) {
                users[userEntry.index] = { ...users[userEntry.index], ...data };
            }
        });
    };
}

export const getTestUserContext = makeSingletonFn(() => new TestUserContext());
