import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import {
  IChangePasswordParameters,
  IChangePasswordResult
} from "../changePassword/types";

export interface IChangePasswordWithTokenContext extends IBaseEndpointContext {
  data: IChangePasswordParameters;
  changePassword: (password: string) => Promise<IChangePasswordResult>;
}
