import makeSingletonFn from "../../utilities/createSingletonFunc";
import { wrapEndpointREST } from "../utils";
import addPermissionGroups from "./addPermissionGroups/addPermissionGroups";
import deletePermissionGroups from "./deletePermissionGroups/deletePermissionGroups";
import getResourcePermissions from "./getResourcePermissions/getResourcePermissions";
import getResourcePermissionGroups from "./getResourcePermissionGroups/getResourcePermissionGroups";
import getUserPermissions from "./getUserPermissions/getUserPermissions";
import permissionGroupExists from "./permissonGroupExists/permissionGroupExists";
import setPermissions from "./setPermissions/setPermissions";
import updatePermissionGroups from "./updatePermissionGroups/updatePermissionGroups";

export default class AccessControlEndpointsGraphQLController {
    public getResourcePermissions = wrapEndpointREST(getResourcePermissions);
    public setPermissions = wrapEndpointREST(setPermissions);
    public getResourcePermissionGroups = wrapEndpointREST(
        getResourcePermissionGroups
    );
    public updatePermissionGroups = wrapEndpointREST(updatePermissionGroups);
    public addPermissionGroups = wrapEndpointREST(addPermissionGroups);
    public deletePermissionGroups = wrapEndpointREST(deletePermissionGroups);
    public permissionGroupExists = wrapEndpointREST(permissionGroupExists);
    public getUserPermissions = wrapEndpointREST(getUserPermissions);
}

export const getAccessControlEndpointsGraphQLController = makeSingletonFn(
    () => new AccessControlEndpointsGraphQLController()
);
