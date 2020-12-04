import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicNotificationData } from "../types";

export interface IGetOrgNotificationsParameters {
    blockId: string;
}

export interface IGetBlockNotificationsResult {
    notifications: IPublicNotificationData[];
}

export type GetBlockNotificationsEndpoint = Endpoint<
    IBaseContext,
    IGetOrgNotificationsParameters,
    IGetBlockNotificationsResult
>;
