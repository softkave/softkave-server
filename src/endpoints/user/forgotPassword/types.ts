import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";

export interface IForgotPasswordParameters {
  email: string;
}

export interface IForgotPasswordContext extends IBaseEndpointContext {
  data: IForgotPasswordParameters;
}
