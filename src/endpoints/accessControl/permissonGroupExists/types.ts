import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IPermissionGroupExistsEndpointParameters {
    blockId: string;
    name: string;
}

export interface IPermissionGroupExistsEndpointResult {
    exists: boolean;
}

export type PermissionGroupExistsEndpoint = Endpoint<
    IBaseContext,
    IPermissionGroupExistsEndpointParameters,
    IPermissionGroupExistsEndpointResult
>;
