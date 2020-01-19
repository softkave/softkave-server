import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { IUser } from "mongo/user";

export interface IChangePasswordParameters {
  password: string;
}

export interface IChangePasswordContext extends IBaseEndpointContext {
  data: IChangePasswordParameters;
  saveUserPasswordHash: (hash: string) => Promise<void>;
}

export interface IChangePasswordResult {
  user: IUser;
  token: string;
}
