import { wrapEndpointREST } from "../utils";
import { Express } from "express";
import { IBaseContext } from "../contexts/IBaseContext";
import addCollaborators from "./addCollaborators/handler";
import getOrganizationRequests from "./getOrganizationRequests/handler";
import getUserRequests from "./getUserRequests/handler";
import markRequestRead from "./markRequestRead/handler";
import respondToRequest from "./respondToRequest/handler";
import revokeRequest from "./revokeRequest/handler";

const baseURL = "/api/collaborationRequests";

export default function setupCollaborationRequestsRESTEndpoints(
    ctx: IBaseContext,
    app: Express
) {
    const endpoints = {
        addCollaborators: wrapEndpointREST(addCollaborators, ctx),
        getOrganizationRequests: wrapEndpointREST(getOrganizationRequests, ctx),
        getUserRequests: wrapEndpointREST(getUserRequests, ctx),
        markRequestRead: wrapEndpointREST(markRequestRead, ctx),
        respondToRequest: wrapEndpointREST(respondToRequest, ctx),
        revokeRequest: wrapEndpointREST(revokeRequest, ctx),
    };

    app.post(`${baseURL}/addCollaborators`, endpoints.addCollaborators);
    app.post(
        `${baseURL}/getOrganizationRequests`,
        endpoints.getOrganizationRequests
    );
    app.post(`${baseURL}/getUserRequests`, endpoints.getUserRequests);
    app.post(`${baseURL}/markRequestRead`, endpoints.markRequestRead);
    app.post(`${baseURL}/respondToRequest`, endpoints.respondToRequest);
    app.post(`${baseURL}/revokeRequest`, endpoints.revokeRequest);
}
