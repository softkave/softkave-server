import { ICollaborationRequest } from "../../../mongo/collaboration-request";
import { IBaseContext } from "../../contexts/BaseContext";
import {
    IPublicCollaborationRequest,
    IPublicNotificationData,
} from "../../notifications/types";
import { Endpoint } from "../../types";

export interface IGetOrganizationNotificationsParameters {
    blockId: string;
}

export interface IGetBlockNotificationsResult {
    notifications: IPublicNotificationData[];
    requests: IPublicCollaborationRequest[];
}

export type GetBlockNotificationsEndpoint = Endpoint<
    IBaseContext,
    IGetOrganizationNotificationsParameters,
    IGetBlockNotificationsResult
>;
