import { wrapEndpointREST } from "../utils";
import { Express } from "express";
import { IBaseContext } from "../contexts/IBaseContext";
import getOrganizationCollaborators from "./getOrganizationCollaborators/handler";
import removeCollaborator from "./removeCollaborator/handler";

const baseURL = "/api/collaborators";

export default function setupBoardsRESTEndpoints(
    ctx: IBaseContext,
    app: Express
) {
    const endpoints = {
        getOrganizationCollaborators: wrapEndpointREST(
            getOrganizationCollaborators,
            ctx
        ),
        removeCollaborator: wrapEndpointREST(removeCollaborator, ctx),
    };

    app.post(
        `${baseURL}/getOrganizationCollaborators`,
        endpoints.getOrganizationCollaborators
    );
    app.post(`${baseURL}/removeCollaborator`, endpoints.removeCollaborator);
}
