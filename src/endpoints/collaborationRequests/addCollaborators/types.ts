import { IBaseContext } from "../../contexts/BaseContext";
import { IPublicCollaborationRequest } from "../../notifications/types";
import { Endpoint } from "../../types";
import sendCollaborationRequestsEmail from "../sendCollaborationRequestEmail";

export interface INewCollaboratorInput {
    email: string;
}

export interface IAddCollaboratorsParameters {
    orgId: string;
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
