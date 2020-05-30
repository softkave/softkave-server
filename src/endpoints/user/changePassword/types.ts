import { IUser } from "../../../mongo/user";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IChangePasswordParameters {
  password: string;
}

export interface IChangePasswordResult {
  user: IUser;
  token: string;
}

export type ChangePasswordEndpoint = Endpoint<
  IBaseContext,
  IChangePasswordParameters,
  IChangePasswordResult
>;
