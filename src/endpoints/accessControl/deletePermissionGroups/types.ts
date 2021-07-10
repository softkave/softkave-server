import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IDeletePermissionGroupsEndpointParameters {
    blockId: string;
    permissionGroups: string[];
}

export type DeletePermissionGroupsEndpoint = Endpoint<
    IBaseContext,
    IDeletePermissionGroupsEndpointParameters
>;
