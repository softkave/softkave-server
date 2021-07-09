import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicOrg } from "../types";

export interface IUpdateOrgInput {
    name?: string;
    description?: string;
    color?: string;
}

export interface IUpdateOrgParameters {
    orgId: string;
    data: IUpdateOrgInput;
}

export interface IUpdateOrgResult {
    org: IPublicOrg;
}

export type UpdateOrgEndpoint = Endpoint<
    IBaseContext,
    IUpdateOrgParameters,
    IUpdateOrgResult
>;
