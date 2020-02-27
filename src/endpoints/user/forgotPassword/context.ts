import BaseEndpointContext, {
  IBaseEndpointContextParameters
} from "../../BaseEndpointContext";
import sendChangePasswordEmail, {
  ISendChangePasswordEmailParameters
} from "../sendChangePasswordEmail";
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

  public async sendChangePasswordEmail(p: ISendChangePasswordEmailParameters) {
    await sendChangePasswordEmail(p);
  }
}
