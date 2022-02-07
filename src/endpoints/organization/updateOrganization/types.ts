import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicOrganization } from "../types";

export interface IUpdateOrganizationInput {
    name?: string;
    description?: string;
    color?: string;
}

export interface IUpdateOrganizationParameters {
    organizationId: string;
    data: IUpdateOrganizationInput;
}

export interface IUpdateOrganizationResult {
    organization: IPublicOrganization;
}

export type UpdateOrganizationEndpoint = Endpoint<
    IBaseContext,
    IUpdateOrganizationParameters,
    IUpdateOrganizationResult
>;
