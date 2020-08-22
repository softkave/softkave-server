import mongoConstants from "../../mongo/constants";
import { IUser } from "../../mongo/user";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";
import { IBulkUpdateById } from "../../utilities/types";
import { UserDoesNotExistError } from "../user/errors";
import { ICollaborator } from "../user/types";
import { IBaseContext } from "./BaseContext";

export interface IUserContext {
  getUserByEmail: (
    ctx: IBaseContext,
    email: string
  ) => Promise<IUser | undefined>;
  bulkGetUsersByEmail: (ctx: IBaseContext, email: string[]) => Promise<IUser[]>;
  getUserById: (
    ctx: IBaseContext,
    customId: string
  ) => Promise<IUser | undefined>;
  updateUserById: (
    ctx: IBaseContext,
    customId: string,
    data: Partial<IUser>,
    ensureUserExists?: boolean
  ) => Promise<boolean | undefined>;
  bulkGetUsersById: (ctx: IBaseContext, ids: string[]) => Promise<IUser[]>;
  saveUser: (ctx: IBaseContext, user: IUser) => Promise<IUser>;
  userExists: (ctx: IBaseContext, email: string) => Promise<boolean>;
  getBlockCollaborators: (
    ctx: IBaseContext,
    blockId: string
  ) => Promise<ICollaborator[]>;
  getOrgUsers: (ctx: IBaseContext, blockId: string) => Promise<IUser[]>;
  bulkUpdateUsersById: (
    ctx: IBaseContext,
    blocks: Array<IBulkUpdateById<IUser>>
  ) => Promise<void>;
}

export default class UserContext implements IUserContext {
  public async getUserByEmail(ctx: IBaseContext, email: string) {
    try {
      return await ctx.models.userModel.model
        .findOne({
          email,
        })
        .lean()
        .exec();
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async getUserById(ctx: IBaseContext, customId: string) {
    try {
      return await ctx.models.userModel.model
        .findOne({
          customId,
        })
        .lean()
        .exec();
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async updateUserById(
    ctx: IBaseContext,
    customId: string,
    data: Partial<IUser>,
    ensureUserExists?: boolean
  ) {
    try {
      if (ensureUserExists) {
        const user = await ctx.models.userModel.model
          .findOneAndUpdate({ customId }, data, { fields: "customId" })
          .exec();

        if (user && user.customId) {
          return true;
        } else {
          throw new UserDoesNotExistError(); // should we include id
        }
      } else {
        await ctx.models.userModel.model.updateOne({ customId }, data).exec();
      }
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async bulkGetUsersById(ctx: IBaseContext, ids: string[]) {
    try {
      return await ctx.models.userModel.model
        .find({ customId: { $in: ids } })
        .exec();
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async saveUser(ctx: IBaseContext, user: IUser) {
    try {
      const userDoc = new ctx.models.userModel.model(user);
      await userDoc.save();
      return userDoc;
    } catch (error) {
      // Adding a user fails with code 11000 if unique fields in this case email or customId exists
      if (error.code === mongoConstants.indexNotUniqueErrorCode) {
        // TODO: Implement a way to get a new customId and retry
        throw new ServerError();
      }

      console.error(error);
      throw new ServerError();
    }
  }

  public async userExists(ctx: IBaseContext, email: string) {
    try {
      return await ctx.models.userModel.model.exists({ email });
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async bulkGetUsersByEmail(ctx: IBaseContext, emails: string[]) {
    try {
      return await ctx.models.userModel.model
        .find({ email: { $in: emails } }, "email orgs")
        .lean()
        .exec();
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async getBlockCollaborators(ctx: IBaseContext, blockId: string) {
    try {
      return await ctx.models.userModel.model
        .find(
          {
            orgs: { $elemMatch: { customId: blockId } },
          },
          "name email createdAt customId color"
        )
        .lean()
        .exec();
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async getOrgUsers(ctx: IBaseContext, blockId: string) {
    try {
      return await ctx.models.userModel.model
        .find({
          orgs: { $elemMatch: { customId: blockId } },
        })
        .lean()
        .exec();
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }

  public async bulkUpdateUsersById(
    ctx: IBaseContext,
    blocks: Array<IBulkUpdateById<IUser>>
  ) {
    try {
      const opts = blocks.map((item) => ({
        updateOne: { filter: { customId: item.id }, update: item.data },
      }));

      await ctx.models.userModel.model.bulkWrite(opts);
    } catch (error) {
      console.error(error);
      throw new ServerError();
    }
  }
}

export const getUserContext = createSingletonFunc(() => new UserContext());
