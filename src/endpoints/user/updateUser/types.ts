import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IUpdateUserParameters {
    name?: string;
    // email?: string; // TODO: handle when the email already exists
    notificationsLastCheckedAt?: Date;
    color?: string;
}

export type UpdateUserEndpoint = Endpoint<IBaseContext, IUpdateUserParameters>;
