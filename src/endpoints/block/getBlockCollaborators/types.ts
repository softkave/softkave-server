import { ICollaborator } from "../../collaborator/types";
import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IGetBlockCollaboratorsParameters {
    blockId: string;
}

export interface IGetBlockCollaboratorsResult {
    collaborators: ICollaborator[];
}

export type GetBlockCollaboratorsEndpoint = Endpoint<
    IBaseContext,
    IGetBlockCollaboratorsParameters,
    IGetBlockCollaboratorsResult
>;
