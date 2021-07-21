import { IBaseContext } from "../../contexts/BaseContext";
import { IPublicCollaborationRequest } from "../../notifications/types";
import { Endpoint } from "../../types";

export interface IGetOrganizationRequestsParameters {
    organizationId: string;
}

export interface IGetBlockNotificationsResult {
    requests: IPublicCollaborationRequest[];
}

export type GetBlockNotificationsEndpoint = Endpoint<
    IBaseContext,
    IGetOrganizationRequestsParameters,
    IGetBlockNotificationsResult
>;
