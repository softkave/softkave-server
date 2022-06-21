import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicCollaborationRequest } from "../types";

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
