import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import UserModel from "mongo/user/UserModel";
import { IUser } from "../../../mongo/user";

export interface ILoginParameters {
  email: string;
  password: string;
  userModel: UserModel;
}

export interface ILoginContext extends IBaseEndpointContext {
  data: ILoginParameters;
  getUserByEmail: (email: string) => Promise<IUser>;
}

export interface ILoginResult {
  user: IUser;
  token: string;
}
