import BaseContext, { IBaseContext } from "../../contexts/BaseContext";
import sendChangePasswordEmail, {
    ISendChangePasswordEmailParameters,
} from "../sendChangePasswordEmail";
import { IForgotPasswordContext } from "./types";

export default class ForgotPasswordContext
    extends BaseContext
    implements IForgotPasswordContext
{
    public async sendChangePasswordEmail(
        ctx: IBaseContext,
        props: ISendChangePasswordEmailParameters
    ) {
        await sendChangePasswordEmail(ctx, props);
    }
}
