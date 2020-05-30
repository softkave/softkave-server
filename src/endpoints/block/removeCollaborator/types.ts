import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IRemoveCollaboratorParameters {
  customId: string;
  collaborator: string;
}

export type RemoveCollaboratorEndpoint = Endpoint<
  IBaseContext,
  IRemoveCollaboratorParameters
>;
