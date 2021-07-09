import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { INewOrgInput, IPublicOrg } from "../types";

export interface ICreateOrgParameters {
    org: INewOrgInput;
}

export interface ICreateOrgResult {
    org: IPublicOrg;
}

export type CreateOrgEndpoint = Endpoint<
    IBaseContext,
    ICreateOrgParameters,
    ICreateOrgResult
>;
