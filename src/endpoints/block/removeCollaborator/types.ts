import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IRemoveCollaboratorParameters {
    blockId: string;
    collaboratorId: string;
}

export type RemoveCollaboratorEndpoint = Endpoint<
    IBaseContext,
    IRemoveCollaboratorParameters
>;
