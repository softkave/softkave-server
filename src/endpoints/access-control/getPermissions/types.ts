import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicPermissionData } from "../types";

export interface IGetPermissionsParameters {
    blockId: string;
}

export interface IGetPermissionsResult {
    permissions: IPublicPermissionData[];
}

export type GetPermissionsEndpoint = Endpoint<
    IBaseContext,
    IGetPermissionsParameters,
    IGetPermissionsResult
>;
