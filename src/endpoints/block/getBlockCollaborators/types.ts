import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { ICollaborator } from "../../user/types";

export interface IGetBlockCollaboratorsParameters {
  customId: string;
}

export interface IGetBlockCollaboratorsResult {
  collaborators: ICollaborator[];
}

export type GetBlockCollaboratorsEndpoint = Endpoint<
  IBaseContext,
  IGetBlockCollaboratorsParameters,
  IGetBlockCollaboratorsResult
>;
