import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IDeletePermissionGroupsEndpointParameters {
    blockId: string;
    permissionGroups: string[];
}

export type DeletePermissionGroupsEndpoint = Endpoint<
    IBaseContext,
    IDeletePermissionGroupsEndpointParameters
>;
