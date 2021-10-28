import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import sendCollaborationRequestsEmail from "../sendCollaborationRequestEmail";
import { IPublicCollaborationRequest } from "../types";

export interface INewCollaboratorInput {
    email: string;
}

export interface IAddCollaboratorsParameters {
    organizationId: string;
    collaborators: INewCollaboratorInput[];
}

export interface IAddCollaboratorsResult {
    requests: IPublicCollaborationRequest[];
}

export interface IAddCollaboratorsContext extends IBaseContext {
    sendCollaborationRequestEmail: typeof sendCollaborationRequestsEmail;
}

export type AddCollaboratorEndpoint = Endpoint<
    IAddCollaboratorsContext,
    IAddCollaboratorsParameters,
    IAddCollaboratorsResult
>;
