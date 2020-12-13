import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IPermissionInput {
    permissionGroups: string[];
    users: string[];
}

export interface ISetPermissionsParameters {
    blockId: string;
    permissions: Array<{
        customId: string;
        data: Partial<IPermissionInput>;
    }>;
}

export interface ISetPermissionsResult {
    permissions: Array<{
        customId: string;
        updatedAt: string;
        updatedBy: string;
    }>;
}

export type SetPermissionsEndpoint = Endpoint<
    IBaseContext,
    ISetPermissionsParameters,
    ISetPermissionsResult
>;
