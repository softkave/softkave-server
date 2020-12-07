import { ICollaborationRequest } from "../../../mongo/collaborationRequest";
import { IBaseContext } from "../../contexts/BaseContext";
import {
    IPublicCollaborationRequest,
    IPublicNotificationData,
} from "../../notifications/types";
import { Endpoint } from "../../types";

export interface IGetOrgNotificationsParameters {
    orgId: string;
}

export interface IGetBlockNotificationsResult {
    notifications: IPublicNotificationData[];
    requests: IPublicCollaborationRequest[];
}

export type GetBlockNotificationsEndpoint = Endpoint<
    IBaseContext,
    IGetOrgNotificationsParameters,
    IGetBlockNotificationsResult
>;
