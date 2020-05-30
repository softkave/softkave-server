import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { ISendCollaborationRequestEmailProps } from "../sendCollabRequestEmail";

interface INewCollaboratorInput {
  email: string;
  body: string;
  expiresAt: string;
  customId: string;
}

export interface IAddCollaboratorsParameters {
  blockId: string;
  collaborators: INewCollaboratorInput[];
}

export interface IAddCollaboratorsContext extends IBaseContext {
  sendCollaborationRequestEmail: (
    props: ISendCollaborationRequestEmailProps
  ) => Promise<any>;
}

export type AddCollaboratorEndpoint = Endpoint<
  IAddCollaboratorsContext,
  IAddCollaboratorsParameters
>;
