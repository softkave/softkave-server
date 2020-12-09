import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import addRoles from "./addRoles/addRoles";
import deleteRoles from "./deleteRoles/deleteRoles";
import getPermissions from "./getPermissions/getPermissions";
import getRoles from "./getRoles/getRoles";
import setPermissions from "./setPermissions/setPermissions";
import updateRoles from "./updateRoles/updateRoles";

export default class AccessControlEndpointsGraphQLController {
    public getPermissions(data, req) {
        return wrapEndpoint(data, req, () =>
            getPermissions(
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

    public getRoles(data, req) {
        return wrapEndpoint(data, req, () =>
            getRoles(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public updateRoles(data, req) {
        return wrapEndpoint(data, req, () =>
            updateRoles(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public addRoles(data, req) {
        return wrapEndpoint(data, req, () =>
            addRoles(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public deleteRoles(data, req) {
        return wrapEndpoint(data, req, () =>
            deleteRoles(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }
}

export const getAccessControlEndpointsGraphQLController = makeSingletonFunc(
    () => new AccessControlEndpointsGraphQLController()
);
