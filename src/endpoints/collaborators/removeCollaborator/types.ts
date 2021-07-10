import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IRemoveCollaboratorParameters {
    orgId: string;
    collaboratorId: string;
}

export type RemoveCollaboratorEndpoint = Endpoint<
    IBaseContext,
    IRemoveCollaboratorParameters
>;
