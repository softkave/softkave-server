import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicClient } from "../../client/types";

export interface IUpdateClientParameters {
    customId: string;
    data: {
        hasUserSeenNotificationsPermissionDialog?: boolean;
        muteChatNotifications?: boolean;
        isSubcribedToPushNotifications?: boolean;
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
