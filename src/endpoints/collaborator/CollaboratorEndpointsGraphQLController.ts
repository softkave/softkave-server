import makeSingletonFn from "../../utilities/createSingletonFunc";
import { wrapEndpointREST } from "../utils";
import getOrganizationCollaborators from "./getOrganizationCollaborators/handler";
import removeCollaborator from "./removeCollaborator/handler";

export default class CollaboratorEndpointsGraphQLController {
    public removeCollaborator = wrapEndpointREST(removeCollaborator);
    public getOrganizationCollaborators = wrapEndpointREST(
        getOrganizationCollaborators
    );
}

export const getCollaboratorEndpointsGraphQLController = makeSingletonFn(
    () => new CollaboratorEndpointsGraphQLController()
);
