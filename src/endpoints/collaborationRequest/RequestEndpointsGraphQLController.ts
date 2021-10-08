import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import addCollaborators from "./addCollaborators/handler";
import AddCollaboratorsContext from "./addCollaborators/context";
import getOrganizationRequests from "./getOrganizationRequests/handler";
import { getRevokeCollaborationRequestContext } from "./revokeRequest/context";
import revokeRequest from "./revokeRequest/handler";
import markRequestsRead from "./markRequestsRead/handler";
import respondToRequest from "./respondToRequest/handler";
import getUserRequests from "./getUserRequests/handler";

export default class RequestsEndpointsGraphQLController {
    public addCollaborators(data, req) {
        return wrapEndpoint(data, req, async () =>
            // @ts-ignore
            addCollaborators(
                new AddCollaboratorsContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public revokeRequest(data, req) {
        return wrapEndpoint(data, req, async () =>
            revokeRequest(
                getRevokeCollaborationRequestContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getOrganizationRequests(data, req) {
        return wrapEndpoint(data, req, async () =>
            getOrganizationRequests(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public respondToRequest(data, req) {
        return wrapEndpoint(data, req, async () =>
            respondToRequest(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public markRequestsRead(data, req) {
        return wrapEndpoint(data, req, async () =>
            markRequestsRead(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getUserRequests(data, req) {
        return wrapEndpoint(data, req, async () =>
            getUserRequests(
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

export const getRequestsEndpointsGraphQLController = makeSingletonFn(
    () => new RequestsEndpointsGraphQLController()
);
