import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IForgotPasswordParameters {
  email: string;
}

export type ForgotPasswordEndpoint = Endpoint<
  IBaseContext,
  IForgotPasswordParameters
>;
