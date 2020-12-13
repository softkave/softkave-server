import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPermissionGroupInput } from "../addPermissionGroups/types";

export interface IUpdatePermissionGroupsPermissionGroupInput
    extends IPermissionGroupInput {
    users?: {
        add: string[];
        remove: string[];
    };
}

export interface IUpdatePermissionGroupsParameters {
    blockId: string;
    permissionGroups: Array<{
        customId: string;
        data: Partial<IUpdatePermissionGroupsPermissionGroupInput>;
    }>;
}

export interface IUpdatePermissionGroupsResult {
    permissionGroups: Array<{
        customId: string;
        updatedAt: string;
        updatedBy: string;
    }>;
}

export type UpdatePermissionGroupsEndpoint = Endpoint<
    IBaseContext,
    IUpdatePermissionGroupsParameters,
    IUpdatePermissionGroupsResult
>;
