import { ServerError } from "utils/errors";
import logger from "utils/logger";
import getUserFromRequest from "../middlewares/getUserFromRequest";
import { IUser } from "../mongo/user";
import UserModel from "../mongo/user/UserModel";
import { IServerRequest } from "../utils/types";

export interface IBaseEndpointContext {
  getUser: () => Promise<IUser>;
  getUserByEmail: (email: string) => Promise<IUser>;
}

export interface IBaseEndpointContextParameters {
  req: IServerRequest;
  userModel: UserModel;
}

export default class BaseEndpointContext implements IBaseEndpointContext {
  protected req: IServerRequest;
  protected userModel: UserModel;

  constructor(p: IBaseEndpointContextParameters) {
    this.req = p.req;
    this.userModel = p.userModel;
  }

  public async getUser() {
    return getUserFromRequest({
      req: this.req,
      userModel: this.userModel,
      required: true
    });
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
}
