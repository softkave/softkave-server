import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import sendCollaborationRequestRevokedEmail from "../sendCollaborationRequestRevokedEmail";
import { IPublicCollaborationRequest } from "../types";

export interface IRevokeCollaborationRequestParameters {
    requestId: string;
    orgId: string;
}

export interface IRevokeCollaborationRequestContext extends IBaseContext {
    sendCollaborationRequestRevokedEmail: typeof sendCollaborationRequestRevokedEmail;
}

export type RevokeCollaborationRequestsEndpoint = Endpoint<
    IRevokeCollaborationRequestContext,
    IRevokeCollaborationRequestParameters,
    { request: IPublicCollaborationRequest }
>;
