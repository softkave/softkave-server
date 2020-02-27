import { IUser } from "../../../mongo/user";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

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
