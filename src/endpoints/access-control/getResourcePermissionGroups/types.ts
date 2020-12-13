import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicPermissionGroup } from "../types";

export interface IGetResourcePermissionGroupsParameters {
    blockId: string;
}

export interface IGetResourcePermissionGroupsResult {
    permissionGroups: IPublicPermissionGroup[];
}

export type GetResourcePermissionGroupsEndpoint = Endpoint<
    IBaseContext,
    IGetResourcePermissionGroupsParameters,
    IGetResourcePermissionGroupsResult
>;
