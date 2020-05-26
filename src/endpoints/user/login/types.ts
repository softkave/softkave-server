import { IUser } from "../../../mongo/user";
import { IBaseEndpointContext } from "../../BaseEndpointContext";
import { IPublicUserData } from "../types";

export interface ILoginParameters {
  email: string;
  password: string;
}

export interface ILoginContext extends IBaseEndpointContext {
  data: ILoginParameters;
}

export interface ILoginResult {
  user: IPublicUserData;
  token: string;
}
