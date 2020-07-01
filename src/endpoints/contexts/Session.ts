import merge from "lodash/merge";
import getUserFromRequest from "../../middlewares/getUserFromRequest";
import { IUser, IUserModel } from "../../mongo/user";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";
import { IServerRequest } from "../../utilities/types";
import { InvalidCredentialsError } from "../user/errors";
import { IBaseUserTokenData } from "../user/UserToken";

export interface ISessionModels {
  userModel: IUserModel;
}

export interface ISessionFnsData {
  req: IServerRequest;
}

// TODO: add validateUserSignin or something like it, to check if the user is signed in
// but the endpoint doesn't need the data

// TODO: how can we validate user signin before getting to the endpoints that require user signin
// for security purposes, in case someone forgets to check

export interface ISessionContext {
  addUserToSession: (
    models: ISessionModels,
    instData: ISessionFnsData,
    user: IUser
  ) => void;
  getUser: (
    models: ISessionModels,
    instData: ISessionFnsData
  ) => Promise<IUser>;
  getRequestToken: (
    models: ISessionModels,
    instData: ISessionFnsData
  ) => IBaseUserTokenData;
  updateUser: (
    models: ISessionModels,
    instData: ISessionFnsData,
    data: Partial<IUser>
  ) => Promise<void>;
}

export default class SessionContext implements ISessionContext {
  public addUserToSession(
    models: ISessionModels,
    instData: ISessionFnsData,
    user: IUser
  ) {
    instData.req.userData = user;
  }

  public async getUser(models: ISessionModels, instData: ISessionFnsData) {
    return getUserFromRequest({
      req: instData.req,
      userModel: models.userModel,
      required: true,
    });
  }

  public getRequestToken(models: ISessionModels, instData: ISessionFnsData) {
    if (instData.req.user) {
      return instData.req.user;
    } else {
      throw new InvalidCredentialsError();
    }
  }

  public async updateUser(
    models: ISessionModels,
    instData: ISessionFnsData,
    data: Partial<IUser>
  ) {
    const user = await this.getUser(models, instData);
    merge(user, data);

    try {
      await models.userModel.model
        .updateOne({ customId: user.customId }, data)
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
