import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicPermissionGroup } from "../types";

export interface IPermissionGroupInput {
    name: string;
    description?: string;
    prevId?: string;
    nextId?: string;
}

export interface IAddPermissionGroupsPermissionGroupInput
    extends IPermissionGroupInput {
    users?: string[];
}

export interface IAddPermissionsGroupParameters {
    blockId: string;
    permissionGroups: Array<{
        tempId: string;
        data: IAddPermissionGroupsPermissionGroupInput;
    }>;
}

export interface IAddPermissionGroupsEndpointResult {
    permissionGroups: Array<{
        tempId: string;
        permissionGroup: IPublicPermissionGroup;
    }>;
}

export type AddPermissionGroupsEndpoint = Endpoint<
    IBaseContext,
    IAddPermissionsGroupParameters,
    IAddPermissionGroupsEndpointResult
>;
