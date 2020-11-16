import { IBaseContext } from "../../contexts/BaseContext";
import { IPublicNotificationData } from "../../notifications/types";
import { Endpoint } from "../../types";

export interface IGetCollaborationRequestsResult {
    notifications: IPublicNotificationData[];
}

export type GetCollaborationRequestsEndpoint = Endpoint<
    IBaseContext,
    undefined,
    IGetCollaborationRequestsResult
>;
