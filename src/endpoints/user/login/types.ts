import UserModel from "mongo/user/UserModel";
import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { IUser } from "../../../mongo/user";

export interface ILoginParameters {
  email: string;
  password: string;
  userModel: UserModel;
}

export interface ILoginContext extends IBaseEndpointContext {
  data: ILoginParameters;
  userExists: (email: string) => Promise<boolean>;
}

export interface ILoginResult {
  user: IUser;
  token: string;
}
