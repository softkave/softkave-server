import { IBaseContext } from "../../contexts/BaseContext";
import { IPublicNotificationData } from "../../notifications/types";
import { Endpoint } from "../../types";

export interface IGetBlockNotificationsParameters {
    blockId: string;
}

export interface IGetBlockNotificationsResult {
    notifications: IPublicNotificationData[];
}

export type GetBlockNotificationsEndpoint = Endpoint<
    IBaseContext,
    IGetBlockNotificationsParameters,
    IGetBlockNotificationsResult
>;
