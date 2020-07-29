import merge from "lodash/merge";
import getUserFromRequest from "../../middlewares/getUserFromRequest";
import { IUser } from "../../mongo/user";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";
import { InvalidCredentialsError } from "../user/errors";
import { IBaseUserTokenData } from "../user/UserToken";
import { IBaseContext } from "./BaseContext";
import RequestData from "./RequestData";

// TODO: how can we validate user signin before getting to the endpoints that require user signin
// for security purposes, in case someone forgets to check

export interface ISessionContext {
  addUserToSession: (ctx: IBaseContext, data: RequestData, user: IUser) => void;
  getUser: (ctx: IBaseContext, data: RequestData) => Promise<IUser>;
  getRequestToken: (ctx: IBaseContext, data: RequestData) => IBaseUserTokenData;
  updateUser: (
    ctx: IBaseContext,
    data: RequestData,
    partialUserData: Partial<IUser>
  ) => Promise<void>;
  assertUser: (ctx: IBaseContext, data: RequestData) => Promise<boolean>;
}

export default class SessionContext implements ISessionContext {
  public addUserToSession(ctx: IBaseContext, data: RequestData, user: IUser) {
    if (data.req) {
      data.req.userData = user;
    }
  }

  public async getUser(ctx: IBaseContext, data: RequestData) {
    return getUserFromRequest({
      req: data.req,
      userModel: ctx.models.userModel,
      required: true,
    });
  }

  public async assertUser(ctx: IBaseContext, data: RequestData) {
    return !!getUserFromRequest({
      req: data.req,
      userModel: ctx.models.userModel,
      required: true,
    });
  }

  public getRequestToken(ctx: IBaseContext, data: RequestData) {
    if (data.req.user) {
      return data.req.user;
    } else {
      throw new InvalidCredentialsError();
    }
  }

  public async updateUser(
    ctx: IBaseContext,
    data: RequestData,
    partialUserData: Partial<IUser>
  ) {
    const user = await this.getUser(ctx, data);
    merge(user, partialUserData);

    try {
      await ctx.models.userModel.model
        .updateOne({ customId: user.customId }, partialUserData)
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}

export const getSessionContext = createSingletonFunc(
  () => new SessionContext()
);
