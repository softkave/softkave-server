import { INotification } from "../../../mongo/notification";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import sendCollabReqEmail from "../sendCollabRequestEmail";

export interface INewCollaboratorInput {
    email: string;
    body: string;
    expiresAt: string;
    customId: string;
}

export interface IAddCollaboratorsParameters {
    blockId: string;
    collaborators: INewCollaboratorInput[];
}

export interface IAddCollaboratorsResult {
    data: INotification[];
}

export interface IAddCollaboratorsContext extends IBaseContext {
    sendCollaborationRequestEmail: typeof sendCollabReqEmail;
}

export type AddCollaboratorEndpoint = Endpoint<
    IAddCollaboratorsContext,
    IAddCollaboratorsParameters,
    IAddCollaboratorsResult
>;
