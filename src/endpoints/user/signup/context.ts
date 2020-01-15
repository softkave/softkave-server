import { Request } from "express";
import BlockModel from "mongo/block/BlockModel";
import { IUser } from "mongo/user";
import UserModel from "mongo/user/UserModel";
import BaseEndpointContext from "../../BaseEndpointContext";
import { INewUser, ISignupContext } from "./types";

export default class SignupContext extends BaseEndpointContext
  implements ISignupContext {
  protected blockModel: BlockModel;

  constructor(req: Request, userModel: UserModel, blockModel: BlockModel) {
    super(req, userModel);
    this.blockModel = blockModel;
  }

  public async createUserRootBlock(user: IUser) {}

  public async saveUser(user: INewUser) {}

  public async userExists(email: string) {}
}
