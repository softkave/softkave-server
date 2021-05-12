import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { ChangePasswordEndpoint } from "../changePassword/types";
import { ILoginResult } from "../login/types";

export interface IUpdateUserParameters {
    name?: string;
    email?: string;
    notificationsLastCheckedAt?: string;
    color?: string;
    password?: string;
}

export interface IUpdateUserEndpointContext extends IBaseContext {
    changePassword: ChangePasswordEndpoint;
}

export type UpdateUserEndpoint = Endpoint<
    IUpdateUserEndpointContext,
    IUpdateUserParameters,
    ILoginResult
>;
