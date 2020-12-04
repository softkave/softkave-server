import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicNotificationData } from "../types";

export interface IGetUserNotificationsResult {
    notifications: IPublicNotificationData[];
}

export type GetCollaborationRequestsEndpoint = Endpoint<
    IBaseContext,
    undefined,
    IGetUserNotificationsResult
>;
