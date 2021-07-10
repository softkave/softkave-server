import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicClient } from "../types";

export interface IUpdateClientParameters {
    data: {
        hasUserSeenNotificationsPermissionDialog?: boolean;
        muteChatNotifications?: boolean;
        isLoggedIn?: boolean;
    };
}

export interface IUpdateClientResult {
    client: IPublicClient;
}

export type UpdateClientEndpoint = Endpoint<
    IBaseContext,
    IUpdateClientParameters,
    IUpdateClientResult
>;
