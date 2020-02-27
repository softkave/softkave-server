import { IUser } from "../../../mongo/user";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

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
