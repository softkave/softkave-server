import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { ISendChangePasswordEmailParameters } from "../sendChangePasswordEmail";

export interface IForgotPasswordParameters {
    email: string;
}

export interface IForgotPasswordContext extends IBaseContext {
    sendChangePasswordEmail: (
        ctx: IBaseContext,
        props: ISendChangePasswordEmailParameters
    ) => Promise<void>;
}

export type ForgotPasswordEndpoint = Endpoint<
    IForgotPasswordContext,
    IForgotPasswordParameters
>;
