import { ICollaborationRequest } from "../../../mongo/collaboration-request";
import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IGetOrganizationNotificationsParameters {
    blockId: string;
}

export interface IGetBlockNotificationsResult {
    notifications: any[];
    requests: any[];
}

export type GetBlockNotificationsEndpoint = Endpoint<
    IBaseContext,
    IGetOrganizationNotificationsParameters,
    IGetBlockNotificationsResult
>;
