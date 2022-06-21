import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { ILoginResult } from "../login/types";

export interface IChangePasswordWithCurrentPasswordEndpointParams {
  currentPassword: string;
  password: string;
}

export type ChangePasswordWithCurrentPasswordEndpoint = Endpoint<
  IBaseContext,
  IChangePasswordWithCurrentPasswordEndpointParams,
  ILoginResult
>;
