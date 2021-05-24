import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { ILoginResult } from "../login/types";

export interface IUpdateUserParameters {
    data: {
        name?: string;
        email?: string;
        notificationsLastCheckedAt?: string;
        color?: string;
    };
}

export type UpdateUserEndpoint = Endpoint<
    IBaseContext,
    IUpdateUserParameters,
    ILoginResult
>;
