import makeSingletonFn from "../../utilities/createSingletonFunc";
import { wrapEndpointREST } from "../wrapEndpointREST";
import addCollaborators from "./addCollaborators/handler";
import AddCollaboratorsContext from "./addCollaborators/context";
import getOrganizationRequests from "./getOrganizationRequests/handler";
import { getRevokeCollaborationRequestContext } from "./revokeRequest/context";
import revokeRequest from "./revokeRequest/handler";
import markRequestRead from "./markRequestRead/handler";
import respondToRequest from "./respondToRequest/handler";
import getUserRequests from "./getUserRequests/handler";

export default class RequestsEndpointsGraphQLController {
    public addCollaborators = wrapEndpointREST(
        addCollaborators,
        new AddCollaboratorsContext()
    );
    public revokeRequest = wrapEndpointREST(
        revokeRequest,
        getRevokeCollaborationRequestContext()
    );
    public getOrganizationRequests = wrapEndpointREST(getOrganizationRequests);
    public respondToRequest = wrapEndpointREST(respondToRequest);
    public markRequestRead = wrapEndpointREST(markRequestRead);
    public getUserRequests = wrapEndpointREST(getUserRequests);
}

export const getRequestsEndpointsGraphQLController = makeSingletonFn(
    () => new RequestsEndpointsGraphQLController()
);
