import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { ISendChangePasswordEmailParameters } from "../sendChangePasswordEmail";

export interface IForgotPasswordParameters {
  email: string;
}

export interface IForgotPasswordContext extends IBaseEndpointContext {
  data: IForgotPasswordParameters;
  sendChangePasswordEmail: (
    p: ISendChangePasswordEmailParameters
  ) => Promise<void>;
}
