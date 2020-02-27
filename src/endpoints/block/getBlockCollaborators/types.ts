import { ICollaborator } from "../../../mongo/user";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

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
