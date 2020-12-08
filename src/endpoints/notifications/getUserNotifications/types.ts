import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCollaborationRequest, IPublicNotificationData } from "../types";

export interface IGetUserNotificationsResult {
    notifications: IPublicNotificationData[];
    requests: IPublicCollaborationRequest[];
}

export type GetCollaborationRequestsEndpoint = Endpoint<
    IBaseContext,
    undefined,
    IGetUserNotificationsResult
>;
