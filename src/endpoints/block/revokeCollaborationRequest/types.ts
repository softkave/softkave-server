import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import sendCollaborationRequestRevokedEmail from "../sendCollaborationRequestRevokedEmail";

export interface IRevokeCollaborationRequestParameters {
    requestId: string;
    blockId: string;
}

export interface IRevokeCollaborationRequestContext extends IBaseContext {
    sendCollaborationRequestRevokedEmail: typeof sendCollaborationRequestRevokedEmail;
}

export type RevokeCollaborationRequestsEndpoint = Endpoint<
    IRevokeCollaborationRequestContext,
    IRevokeCollaborationRequestParameters
>;
