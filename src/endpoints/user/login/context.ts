import { Request } from "express";
import BaseEndpointContext from "endpoints/BaseEndpointContext";
import { ILoginContext } from "./types";
import UserModel from "mongo/user/UserModel";

export default class LoginContext extends BaseEndpointContext
  implements ILoginContext {
  constructor(req: Request, userModel: UserModel) {
    super(req, userModel);
    //i'm not sure of the things required in the class, so i'm going to
    //push fro your assistance on this
  }

  public async userExists(email: string) {}
}
