import mongoConstants from "../../mongo/constants";
import { IUser, IUserModel } from "../../mongo/user";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";
import { UserDoesNotExistError } from "../user/errors";
import { ICollaborator } from "../user/types";
import { IBulkUpdateByIdItem } from "./types";

export interface IUserContextModels {
  userModel: IUserModel;
}

export interface IUserContext {
  getUserByEmail: (
    models: IUserContextModels,
    email: string
  ) => Promise<IUser | undefined>;
  bulkGetUsersByEmail: (
    models: IUserContextModels,
    email: string[]
  ) => Promise<IUser[]>;
  getUserById: (
    models: IUserContextModels,
    customId: string
  ) => Promise<IUser | undefined>;
  updateUserById: (
    models: IUserContextModels,
    customId: string,
    data: Partial<IUser>,
    ensureUserExists?: boolean
  ) => Promise<boolean | undefined>;
  bulkGetUsersById: (
    models: IUserContextModels,
    ids: string[]
  ) => Promise<IUser[]>;
  saveUser: (models: IUserContextModels, user: IUser) => Promise<IUser>;
  userExists: (models: IUserContextModels, email: string) => Promise<boolean>;
  getBlockCollaborators: (
    models: IUserContextModels,
    blockId: string
  ) => Promise<ICollaborator[]>;
  getOrgUsers: (
    models: IUserContextModels,
    blockId: string
  ) => Promise<IUser[]>;
  bulkUpdateUsersById: (
    models: IUserContextModels,
    blocks: Array<IBulkUpdateByIdItem<IUser>>
  ) => Promise<void>;
}

export default class UserContext implements IUserContext {
  public async getUserByEmail(models: IUserContextModels, email: string) {
    try {
      return await models.userModel.model
        .findOne({
          email,
        })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getUserById(models: IUserContextModels, customId: string) {
    try {
      return await models.userModel.model
        .findOne({
          customId,
        })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async updateUserById(
    models: IUserContextModels,
    customId: string,
    data: Partial<IUser>,
    ensureUserExists?: boolean
  ) {
    try {
      if (ensureUserExists) {
        const user = await models.userModel.model
          .findOneAndUpdate({ customId }, data, { fields: "customId" })
          .exec();

        if (user && user.customId) {
          return true;
        } else {
          throw new UserDoesNotExistError(); // should we include id
        }
      } else {
        await models.userModel.model.updateOne({ customId }, data).exec();
      }
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async bulkGetUsersById(models: IUserContextModels, ids: string[]) {
    try {
      return await models.userModel.model
        .find({ customId: { $in: ids } })
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async saveUser(models: IUserContextModels, user: IUser) {
    try {
      const userDoc = new models.userModel.model(user);
      await userDoc.save();
      return userDoc;
    } catch (error) {
      // Adding a user fails with code 11000 if unique fields in this case email or customId exists
      if (error.code === mongoConstants.indexNotUniqueErrorCode) {
        // TODO: Implement a way to get a new customId and retry
        throw new ServerError();
      }

      logger.error(error);
      throw new ServerError();
    }
  }

  public async userExists(models: IUserContextModels, email: string) {
    try {
      return await models.userModel.model.exists({ email });
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async bulkGetUsersByEmail(models, emails) {
    try {
      return await models.userModel.model
        .find({ email: { $in: emails } }, "email orgs")
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getBlockCollaborators(
    models: IUserContextModels,
    blockId: string
  ) {
    try {
      return await models.userModel.model
        .find(
          {
            orgs: { $elemMatch: { customId: blockId } },
          },
          "name email createdAt customId color"
        )
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getOrgUsers(models: IUserContextModels, blockId: string) {
    try {
      return await models.userModel.model
        .find({
          orgs: { $elemMatch: { customId: blockId } },
        })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async bulkUpdateUsersById(
    models: IUserContextModels,
    blocks: Array<IBulkUpdateByIdItem<IUser>>
  ) {
    try {
      const opts = blocks.map((item) => ({
        updateOne: { filter: { customId: item.id }, update: item.data },
      }));

      await models.userModel.model.bulkWrite(opts);
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
