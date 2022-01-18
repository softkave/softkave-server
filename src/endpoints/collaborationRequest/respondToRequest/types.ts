import { CollaborationRequestResponse } from "../../../mongo/collaboration-request";
import { IBaseContext } from "../../contexts/IBaseContext";
import { IPublicOrganization } from "../../organization/types";
import { Endpoint } from "../../types";

export interface IRespondToCollaborationRequestParameters {
    requestId: string;
    response: CollaborationRequestResponse;
}
export interface IRespondToCollaborationRequestResult {
    organization?: IPublicOrganization;
    respondedAt: string;
}

export type RespondToCollaborationRequestEndpoint = Endpoint<
    IBaseContext,
    IRespondToCollaborationRequestParameters,
    IRespondToCollaborationRequestResult
>;
