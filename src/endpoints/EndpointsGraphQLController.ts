import makeSingletonFn from "../utilities/createSingletonFunc";
import { getBoardEndpointsGraphQLController } from "./board";
import { getClientsEndpointsGraphQLController } from "./client";
import { getRequestsEndpointsGraphQLController } from "./collaborationRequest/RequestEndpointsGraphQLController";
import { getCollaboratorEndpointsGraphQLController } from "./collaborator";
import { getCustomPropertyEndpointsGraphQLController } from "./customProperty/CustomPropertyEndpointsGraphQLController";
import { getOrganizationEndpointsGraphQLController } from "./organization";
import { getSprintsEndpointsGraphQLController } from "./sprints/SprintsEndpointsGraphQLController";
import { getSystemEndpointsGraphQLController } from "./system/SystemEndpointsGraphQLController";
import { getTaskEndpointsGraphQLController } from "./task";
import { getUserEndpointsGraphQLController } from "./user/UserEndpointsGraphQLController";

export default class EndpointsGraphQLController {
    public user = getUserEndpointsGraphQLController();
    public sprint = getSprintsEndpointsGraphQLController();
    public system = getSystemEndpointsGraphQLController();
    public collaborationRequest = getRequestsEndpointsGraphQLController();
    public client = getClientsEndpointsGraphQLController();
    public collaborators = getCollaboratorEndpointsGraphQLController();
    public organization = getOrganizationEndpointsGraphQLController();
    public board = getBoardEndpointsGraphQLController();
    public task = getTaskEndpointsGraphQLController();
    // public customProperty = getCustomPropertyEndpointsGraphQLController();
}

export const getEndpointsGraphQLController = makeSingletonFn(
    () => new EndpointsGraphQLController()
);
