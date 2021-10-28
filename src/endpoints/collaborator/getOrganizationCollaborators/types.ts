import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { ICollaborator } from "../types";

export interface IGetOrganizationCollaboratorsParameters {
    organizationId: string;
}

export interface IGetOrganizationCollaboratorsResult {
    collaborators: ICollaborator[];
}

export type GetOrganizationCollaboratorsEndpoint = Endpoint<
    IBaseContext,
    IGetOrganizationCollaboratorsParameters,
    IGetOrganizationCollaboratorsResult
>;
