import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import getPermissions from "./getPermissions/getPermissions";
import getRoles from "./getRoles/getRoles";
import setPermissions from "./setPermissions/setPermissions";
import setRoles from "./setRoles/setRoles";

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

    public setRoles(data, req) {
        return wrapEndpoint(data, req, () =>
            setRoles(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }
}

export const getAccessControlEndpointsGraphQLController = makeSingletonFunc(
    () => new AccessControlEndpointsGraphQLController()
);
