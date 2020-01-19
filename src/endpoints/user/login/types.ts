import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { IUser } from "../../../mongo/user";

export interface ILoginParameters {
  email: string;
  password: string;
}

export interface ILoginContext extends IBaseEndpointContext {
  data: ILoginParameters;
}

export interface ILoginResult {
  user: IUser;
  token: string;
}
