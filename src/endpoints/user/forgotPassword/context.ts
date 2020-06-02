import BaseContext from "../../contexts/BaseContext";
import sendChangePasswordEmail, {
  ISendChangePasswordEmailParameters,
} from "../sendChangePasswordEmail";
import { IForgotPasswordContext } from "./types";

export default class ForgotPasswordContext extends BaseContext
  implements IForgotPasswordContext {
  public async sendChangePasswordEmail(
    props: ISendChangePasswordEmailParameters
  ) {
    await sendChangePasswordEmail(props);
  }
}
