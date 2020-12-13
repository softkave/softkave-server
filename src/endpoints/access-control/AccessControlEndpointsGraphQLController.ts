import makeSingletonFunc from "../../utilities/createSingletonFunc";
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
        return wrapEndpoint(data, req, () =>
            getResourcePermissions(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public setPermissions(data, req) {
        return wrapEndpoint(data, req, () =>
            setPermissions(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public getResourcePermissionGroups(data, req) {
        return wrapEndpoint(data, req, () =>
            getResourcePermissionGroups(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public updatePermissionGroups(data, req) {
        return wrapEndpoint(data, req, () =>
            updatePermissionGroups(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public addPermissionGroups(data, req) {
        return wrapEndpoint(data, req, () =>
            addPermissionGroups(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public deletePermissionGroups(data, req) {
        return wrapEndpoint(data, req, () =>
            deletePermissionGroups(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public permissionGroupExists(data, req) {
        return wrapEndpoint(data, req, () =>
            permissionGroupExists(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public getUserPermissions(data, req) {
        return wrapEndpoint(data, req, () =>
            getUserPermissions(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }
}

export const getAccessControlEndpointsGraphQLController = makeSingletonFunc(
    () => new AccessControlEndpointsGraphQLController()
);
