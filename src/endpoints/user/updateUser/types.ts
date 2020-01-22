import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { IUser } from "../../../mongo/user";

export interface IUpdateUserParameters {
  name?: string;
  email?: string;
  lastNotificationCheckTime?: number;
  color?: string;
}

export interface IUpdateUserContext extends IBaseEndpointContext {
  data: IUpdateUserParameters;
}

export interface IUpdateUserResult {
  user: IUser;
  token: string;
}
