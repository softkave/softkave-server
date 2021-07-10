import { CollaborationRequestResponse } from "../../../mongo/collaboration-request";
import { IBaseContext } from "../../contexts/BaseContext";
import { IPublicOrg } from "../../org/types";
import { Endpoint } from "../../types";

export interface IRespondToCollaborationRequestParameters {
    requestId: string;
    response: CollaborationRequestResponse;
}
export interface IRespondToCollaborationRequestResult {
    org?: IPublicOrg;
    respondedAt: string;
}

export type RespondToCollaborationRequestEndpoint = Endpoint<
    IBaseContext,
    IRespondToCollaborationRequestParameters,
    IRespondToCollaborationRequestResult
>;
