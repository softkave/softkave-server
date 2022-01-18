import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicPermission } from "../types";

export interface IGetPermissionsParameters {
    blockId: string;
}

export interface IGetResourcePermissionsResult {
    permissions: IPublicPermission[];
}

export type GetResourcePermissionsEndpoint = Endpoint<
    IBaseContext,
    IGetPermissionsParameters,
    IGetResourcePermissionsResult
>;
