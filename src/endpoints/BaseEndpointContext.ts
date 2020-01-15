import getUserFromRequest from "../middlewares/getUserFromRequest";
import { IUser } from "../mongo/user";
import UserModel from "../mongo/user/UserModel";
import { IServerRequest } from "../utils/types";

export interface IBaseEndpointContext {
  getUser: () => Promise<IUser>;
}

export default class BaseEndpointContext implements IBaseEndpointContext {
  protected req: IServerRequest;
  protected userModel: UserModel;

  constructor(req: IServerRequest, userModel: UserModel) {
    this.req = req;
    this.userModel = userModel;
  }

  public async getUser() {
    return getUserFromRequest({
      req: this.req,
      userModel: this.userModel,
      required: true
    });
  }
}
