import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IOrganizationExistsParameters {
    name: string;
}

export interface IOrganizationExistsResult {
    exists: boolean;
}

export type OrganizationExistsEndpoint = Endpoint<
    IBaseContext,
    IOrganizationExistsParameters,
    IOrganizationExistsResult
>;
