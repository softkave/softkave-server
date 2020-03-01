import merge from "lodash/merge";
import getUserFromRequest from "../middlewares/getUserFromRequest";
import { IBlock } from "../mongo/block";
import BlockModel from "../mongo/block/BlockModel";
import { INotification } from "../mongo/notification";
import NotificationModel from "../mongo/notification/NotificationModel";
import { IUser } from "../mongo/user";
import UserModel from "../mongo/user/UserModel";
import { ServerError } from "../utilities/errors";
import logger from "../utilities/logger";
import { IServerRequest } from "../utilities/types";
import { InvalidCredentialsError } from "./user/errors";
import { IBaseUserTokenData } from "./user/UserToken";

export interface IBulkUpdateByIDItem<T> {
  id: string;
  data: Partial<T>;
}

export interface IBaseEndpointContext {
  addUserToReq: (user: IUser) => void;

  getUser: () => Promise<IUser>;
  getUserByEmail: (email: string) => Promise<IUser>;
  getUserByCustomID: (customId: string) => Promise<IUser>;
  getRequestToken: () => IBaseUserTokenData;
  getBlockByID: (customId: string) => Promise<IBlock>;
  getBlockListWithIDs: (customIds: string[]) => Promise<IBlock[]>;
  getNotificationByID: (customId: string) => Promise<INotification>;

  updateUser: (data: Partial<IUser>) => Promise<void>;
  updateUserByID: (customId: string, data: Partial<IUser>) => Promise<void>;
  updateBlockByID: (customId: string, data: Partial<IBlock>) => Promise<void>;
  updateNotificationByID: (
    customId: string,
    data: Partial<INotification>
  ) => Promise<void>;

  bulkUpdateBlocksByID: (
    blocks: Array<IBulkUpdateByIDItem<IBlock>>
  ) => Promise<void>;
}

export interface IBaseEndpointContextParameters {
  req: IServerRequest;
  userModel: UserModel;
  blockModel: BlockModel;
  notificationModel: NotificationModel;
}

export default class BaseEndpointContext implements IBaseEndpointContext {
  protected req: IServerRequest;
  protected userModel: UserModel;
  protected blockModel: BlockModel;
  protected notificationModel: NotificationModel;
  protected p: IBaseEndpointContextParameters;

  constructor(p: IBaseEndpointContextParameters) {
    this.req = p.req;
    this.userModel = p.userModel;
    this.blockModel = p.blockModel;
    this.notificationModel = p.notificationModel;
    this.p = p;
  }

  public addUserToReq(user: IUser) {
    this.req.fullUserData = user;
  }

  public async getUser() {
    return getUserFromRequest({
      req: this.req,
      userModel: this.userModel,
      required: true
    });
  }

  public getRequestToken() {
    if (this.req.user) {
      return this.req.user;
    } else {
      throw new InvalidCredentialsError();
    }
  }

  public async getUserByEmail(email: string) {
    try {
      return await this.userModel.model
        .findOne({
          email
        })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getUserByCustomID(customId: string) {
    try {
      return await this.userModel.model
        .findOne({
          customId
        })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getBlockByID(blockID: string) {
    try {
      return await this.blockModel.model
        .findOne({
          customId: blockID
        })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getBlockListWithIDs(customIds: string[]) {
    try {
      const query = {
        customId: { $in: customIds }
      };

      return await this.blockModel.model.find(query).exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async getNotificationByID(id: string) {
    try {
      return await this.notificationModel.model
        .findOne({ customId: id })
        .lean()
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async updateUser(data: Partial<IUser>) {
    const user = await this.getUser();
    merge(user, data);

    try {
      await this.userModel.model
        .updateOne({ customId: user.customId }, data)
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async updateUserByID(customId: string, data: Partial<IUser>) {
    try {
      await this.userModel.model.updateOne({ customId }, data).exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async updateBlockByID(customId: string, data: Partial<IBlock>) {
    try {
      await this.blockModel.model.updateOne({ customId }, data).exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async updateNotificationByID(
    customId: string,
    data: Partial<INotification>
  ) {
    try {
      await this.notificationModel.model.updateOne({ customId }, data).exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  public async bulkUpdateBlocksByID(
    blocks: Array<IBulkUpdateByIDItem<IBlock>>
  ) {
    try {
      await this.blockModel.model.bulkWrite(
        blocks.map(b => ({
          updateOne: { filter: { customId: b.id }, update: b.data }
        }))
      );
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
