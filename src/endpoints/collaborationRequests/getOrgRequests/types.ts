import { IBaseContext } from "../../contexts/BaseContext";
import { IPublicCollaborationRequest } from "../../notifications/types";
import { Endpoint } from "../../types";

export interface IGetOrgRequestsParameters {
    orgId: string;
}

export interface IGetBlockNotificationsResult {
    requests: IPublicCollaborationRequest[];
}

export type GetBlockNotificationsEndpoint = Endpoint<
    IBaseContext,
    IGetOrgRequestsParameters,
    IGetBlockNotificationsResult
>;
