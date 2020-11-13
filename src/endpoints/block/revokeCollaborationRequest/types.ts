import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IRevokeCollaborationRequestParameters {
    requestId: string;
    blockId: string;
}

export type RevokeCollaborationRequestsEndpoint = Endpoint<
    IBaseContext,
    IRevokeCollaborationRequestParameters
>;
