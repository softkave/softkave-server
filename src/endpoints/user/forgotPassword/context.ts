import BaseContext from "../../contexts/BaseContext";
import sendChangePasswordEmail, {
    ISendChangePasswordEmailParameters,
} from "../sendChangePasswordEmail";
import { IForganizationotPasswordContext } from "./types";

export default class ForganizationotPasswordContext
    extends BaseContext
    implements IForganizationotPasswordContext
{
    public async sendChangePasswordEmail(
        props: ISendChangePasswordEmailParameters
    ) {
        await sendChangePasswordEmail(props);
    }
}
