import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IUpdateClientParameters {
    customId: string;
    data: {
        hasNotificationsAPI?: boolean;
        grantedNotificationsPermission?: boolean;
    };
}

export type UpdateClientEndpoint = Endpoint<
    IBaseContext,
    IUpdateClientParameters
>;
