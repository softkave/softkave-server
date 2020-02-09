import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import { ICollaborator } from "mongo/user";

export interface IGetBlockCollaboratorsParameters {
  customId: string;
}

export interface IGetBlockCollaboratorsContext extends IBaseEndpointContext {
  data: IGetBlockCollaboratorsParameters;
  getBlockCollaborators: (blockID: string) => Promise<ICollaborator[]>;
}

export interface IGetBlockCollaboratorsResult {
  collaborators: ICollaborator[];
}
