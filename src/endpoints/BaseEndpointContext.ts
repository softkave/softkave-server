import { IBlock } from "mongo/block";
import BlockModel from "mongo/block/BlockModel";
import { ServerError } from "utils/errors";
import logger from "utils/logger";
import getUserFromRequest from "../middlewares/getUserFromRequest";
import { IUser } from "../mongo/user";
import UserModel from "../mongo/user/UserModel";
import { IServerRequest } from "../utils/types";
import { InvalidCredentialsError } from "./user/errors";
import { IBaseUserTokenData } from "./user/UserToken";

export interface IBaseEndpointContext {
  getUser: () => Promise<IUser>;
  getUserByEmail: (email: string) => Promise<IUser>;
  getRequestToken: () => IBaseUserTokenData;
  getBlockByID: (blockID: string) => Promise<IBlock>;
}

export interface IBaseEndpointContextParameters {
  req: IServerRequest;
  userModel: UserModel;
  blockModel: BlockModel;
}

export default class BaseEndpointContext implements IBaseEndpointContext {
  protected req: IServerRequest;
  protected userModel: UserModel;
  protected blockModel: BlockModel;

  constructor(p: IBaseEndpointContextParameters) {
    this.req = p.req;
    this.userModel = p.userModel;
    this.blockModel = p.blockModel;
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

  public async getBlockByID(blockID: string) {}
}
