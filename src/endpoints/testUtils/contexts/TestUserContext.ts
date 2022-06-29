import { IUser } from "../../../mongo/user";
import makeSingletonFn from "../../../utilities/createSingletonFunc";
import { indexArray } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { IUpdateItemById } from "../../../utilities/types";
import { IBaseContext } from "../../contexts/IBaseContext";
import { IUserContext } from "../../contexts/UserContext";
import { UserDoesNotExistError } from "../../user/errors";

class TestUserContext implements IUserContext {
  users: IUser[] = [];

  getUserByEmail = async (ctx: IBaseContext, email: string) => {
    email = email.toLowerCase();
    return (
      this.users.find((user) => {
        console.log(user.email, "      ", email);
        return user.email.toLowerCase() === email;
      }) || null
    );
  };

  bulkGetUsersByEmail = async (ctx: IBaseContext, emails: string[]) => {
    const emailMap = indexArray(emails, {
      indexer: (email) => email.toLowerCase(),
    });

    return this.users.filter((user) => emailMap[user.email.toLowerCase()]);
  };

  getUserById = async (ctx: IBaseContext, customId: string) => {
    return this.users.find((user) => user.customId === customId) || null;
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
    const index = this.users.findIndex((user) => user.customId === customId);

    if (index === -1) {
      return null;
    }

    this.users[index] = { ...this.users[index], ...data };
    return this.users[index];
  };

  bulkGetUsersById = async (ctx: IBaseContext, ids: string[]) => {
    const usersMap = indexArray(this.users, { path: "customId" });
    const data: IUser[] = [];
    ids.forEach((id) => {
      if (usersMap[id]) {
        data.push(usersMap[id]);
      }
    });

    return data;
  };

  saveUser = async (ctx: IBaseContext, user: Omit<IUser, "customId">) => {
    this.users.push({
      ...user,
      customId: getNewId(),
    });

    return this.users[this.users.length - 1];
  };

  userExists = async (ctx: IBaseContext, email: string) => {
    return !!(await ctx.user.getUserByEmail(ctx, email));
  };

  getBlockCollaborators = async (ctx: IBaseContext, blockId: string) => {
    return this.users.filter((user) => {
      return (
        user.orgs &&
        user.orgs.findIndex(
          (organization) => organization.customId === blockId
        ) !== -1
      );
    });
  };

  getOrganizationUsers = async (ctx: IBaseContext, blockId: string) => {
    return this.users.filter((user) => {
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
    const usersMap = indexArray(this.users, {
      path: "customId",
      reducer: (user, arr, index) => ({ user, index }),
    });

    inputUsers.forEach(({ id, data }) => {
      const userEntry = usersMap[id];

      if (userEntry) {
        this.users[userEntry.index] = {
          ...this.users[userEntry.index],
          ...data,
        };
      }
    });
  };
}

export const getTestUserContext = makeSingletonFn(() => new TestUserContext());
