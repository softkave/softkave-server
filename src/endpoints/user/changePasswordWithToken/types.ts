import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { IChangePasswordParameters } from "../changePassword/types";

export interface IChangePasswordWithTokenContext extends IBaseEndpointContext {
  data: IChangePasswordParameters;
  changePassword: () => Promise<void>;
}
