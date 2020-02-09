import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";

interface INewCollaboratorInput {
  email: string;
  body: string;
  expiresAt: number;
}

export interface IAddCollaboratorsParameters {
  collaborators: INewCollaboratorInput[];
}

export interface IAddCollaboratorsContext extends IBaseEndpointContext {
  data: IAddCollaboratorsParameters;
}
