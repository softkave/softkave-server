import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { ICollaborator } from "../../user/types";

export interface IGetOrgCollaboratorsParameters {
    orgId: string;
}

export interface IGetOrgCollaboratorsResult {
    collaborators: ICollaborator[];
}

export type GetOrgCollaboratorsEndpoint = Endpoint<
    IBaseContext,
    IGetOrgCollaboratorsParameters,
    IGetOrgCollaboratorsResult
>;
