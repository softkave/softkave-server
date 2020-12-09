import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IRoleExistsEndpointParameters {
    blockId: string;
    name: string;
}

export interface IRoleExistsEndpointResult {
    exists: boolean;
}

export type RoleExistsEndpoint = Endpoint<
    IBaseContext,
    IRoleExistsEndpointParameters,
    IRoleExistsEndpointResult
>;
