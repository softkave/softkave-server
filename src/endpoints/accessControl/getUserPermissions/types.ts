import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { IPublicUserAssignedPermissionGroup } from "../types";

export interface IGetUserPermissionsResult {
    permissionGroups: IPublicUserAssignedPermissionGroup[];
}

export type GetUserPermissionsEndpoint = Endpoint<
    IBaseContext,
    void,
    IGetUserPermissionsResult
>;
