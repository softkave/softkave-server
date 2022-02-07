import { IPublicCollaborationRequest } from "../../collaborationRequest/types";
import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import sendCollabReqEmail from "../sendCollaborationRequestEmail";

export interface INewCollaboratorInput {
    email: string;
    customId: string;
}

export interface IAddCollaboratorsParameters {
    blockId: string;
    collaborators: INewCollaboratorInput[];
}

export interface IAddCollaboratorsResult {
    requests: IPublicCollaborationRequest[];
}

export interface IAddCollaboratorsContext extends IBaseContext {
    sendCollaborationRequestEmail: typeof sendCollabReqEmail;
}

export type AddCollaboratorEndpoint = Endpoint<
    IAddCollaboratorsContext,
    IAddCollaboratorsParameters,
    IAddCollaboratorsResult
>;
