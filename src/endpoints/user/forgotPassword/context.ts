import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "endpoints/BaseEndpointContext";
import { IForgotPasswordContext, IForgotPasswordParameters } from "./types";

export interface IForgotPasswordContextParameters
  extends IBaseEndpointContextParameters {
  data: IForgotPasswordParameters;
}

export default class ForgotPasswordContext extends BaseEndpointContext
  implements IForgotPasswordContext {
  public data: IForgotPasswordParameters;

  constructor(p: IForgotPasswordContextParameters) {
    super(p);
    this.data = p.data;
  }
}
