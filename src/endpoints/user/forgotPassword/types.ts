import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { ISendChangePasswordEmailParameters } from "../sendChangePasswordEmail";

export interface IForganizationotPasswordParameters {
    email: string;
}

export interface IForganizationotPasswordContext extends IBaseContext {
    sendChangePasswordEmail: (
        props: ISendChangePasswordEmailParameters
    ) => Promise<void>;
}

export type ForganizationotPasswordEndpoint = Endpoint<
    IForganizationotPasswordContext,
    IForganizationotPasswordParameters
>;
