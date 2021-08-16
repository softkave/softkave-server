import getSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import addPermissionGroups from "./addPermissionGroups/addPermissionGroups";
import deletePermissionGroups from "./deletePermissionGroups/deletePermissionGroups";
import getResourcePermissions from "./getResourcePermissions/getResourcePermissions";
import getResourcePermissionGroups from "./getResourcePermissionGroups/getResourcePermissionGroups";
import getUserPermissions from "./getUserPermissions/getUserPermissions";
import permissionGroupExists from "./permissonGroupExists/permissionGroupExists";
import setPermissions from "./setPermissions/setPermissions";
import updatePermissionGroups from "./updatePermissionGroups/updatePermissionGroups";

export default class AccessControlEndpointsGraphQLController {
    public getResourcePermissions(data, req) {
        return wrapEndpoint(data, req, async () =>
            getResourcePermissions(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public setPermissions(data, req) {
        return wrapEndpoint(data, req, async () =>
            setPermissions(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getResourcePermissionGroups(data, req) {
        return wrapEndpoint(data, req, async () =>
            getResourcePermissionGroups(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public updatePermissionGroups(data, req) {
        return wrapEndpoint(data, req, async () =>
            updatePermissionGroups(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public addPermissionGroups(data, req) {
        return wrapEndpoint(data, req, async () =>
            addPermissionGroups(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public deletePermissionGroups(data, req) {
        return wrapEndpoint(data, req, async () =>
            deletePermissionGroups(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public permissionGroupExists(data, req) {
        return wrapEndpoint(data, req, async () =>
            permissionGroupExists(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getUserPermissions(data, req) {
        return wrapEndpoint(data, req, async () =>
            getUserPermissions(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }
}

export const getAccessControlEndpointsGraphQLController = getSingletonFunc(
    () => new AccessControlEndpointsGraphQLController()
);
