import BaseContext from "../../contexts/BaseContext";
import { IBaseEndpointContextParameters } from "../../contexts/BaseEndpointContext";
import sendChangePasswordEmail, {
  ISendChangePasswordEmailParameters,
} from "../sendChangePasswordEmail";
import { IForgotPasswordContext, IForgotPasswordParameters } from "./types";

export interface IForgotPasswordContextParameters
  extends IBaseEndpointContextParameters {
  data: IForgotPasswordParameters;
}

export default class ForgotPasswordContext extends BaseContext
  implements IForgotPasswordContext {
  public async sendChangePasswordEmail(
    props: ISendChangePasswordEmailParameters
  ) {
    await sendChangePasswordEmail(props);
  }
}
