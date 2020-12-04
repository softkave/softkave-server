import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicNotificationData } from "../types";

export interface IGetOrgNotificationsParameters {
    orgId: string;
}

export interface IGetOrgNotificationsResult {
    notifications: IPublicNotificationData[];
}

export type GetOrgNotificationsEndpoint = Endpoint<
    IBaseContext,
    IGetOrgNotificationsParameters,
    IGetOrgNotificationsResult
>;
