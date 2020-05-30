import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { ISendChangePasswordEmailParameters } from "../sendChangePasswordEmail";

export interface IForgotPasswordParameters {
  email: string;
}

export interface IForgotPasswordContext extends IBaseContext {
  sendChangePasswordEmail: (
    props: ISendChangePasswordEmailParameters
  ) => Promise<void>;
}

export type ForgotPasswordEndpoint = Endpoint<
  IForgotPasswordContext,
  IForgotPasswordParameters
>;
