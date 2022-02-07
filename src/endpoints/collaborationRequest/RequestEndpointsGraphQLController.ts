import makeSingletonFn from "../../utilities/createSingletonFunc";
import { wrapEndpointREST } from "../wrapEndpointREST";
import addCollaborators from "./addCollaborators/handler";
import getOrganizationRequests from "./getOrganizationRequests/handler";
import revokeRequest from "./revokeRequest/handler";
import markRequestRead from "./markRequestRead/handler";
import respondToRequest from "./respondToRequest/handler";
import getUserRequests from "./getUserRequests/handler";
import { getBaseContext } from "../contexts/BaseContext";
import { makeAddCollaboratorContext } from "./addCollaborators/context";
import { makeRevokeRequestContext } from "./revokeRequest/context";

export default class RequestsEndpointsGraphQLController {
    public addCollaborators = wrapEndpointREST(
        addCollaborators,
        makeAddCollaboratorContext(getBaseContext())
    );
    public revokeRequest = wrapEndpointREST(
        revokeRequest,
        makeRevokeRequestContext(getBaseContext())
    );
    public getOrganizationRequests = wrapEndpointREST(getOrganizationRequests);
    public respondToRequest = wrapEndpointREST(respondToRequest);
    public markRequestRead = wrapEndpointREST(markRequestRead);
    public getUserRequests = wrapEndpointREST(getUserRequests);
}

export const getRequestsEndpointsGraphQLController = makeSingletonFn(
    () => new RequestsEndpointsGraphQLController()
);
