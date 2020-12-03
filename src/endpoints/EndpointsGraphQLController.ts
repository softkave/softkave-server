import makeSingletonFunc from "../utilities/createSingletonFunc";
import AccessControlEndpointsGraphQLController, {
    getAccessControlEndpointsGraphQLController,
} from "./access-control/AccessControlEndpointsGraphQLController";
import BlockEndpointsGraphQLController, {
    getBlockEndpointsGraphQLController,
} from "./block/BlockEndpointsGraphQLController";
import CommentsEndpointsGraphQLController, {
    getCommentsEndpointsGraphQLController,
} from "./comments/CommentsEndpointsGraphQLController";
import NotesEndpointsGraphQLController, {
    getNotesEndpointsGraphQLController,
} from "./notes/NotesEndpointsGraphQLController";
import SprintsEndpointsGraphQLController, {
    getSprintsEndpointsGraphQLController,
} from "./sprints/SprintsEndpointsGraphQLController";
import SystemEndpointsGraphQLController, {
    getSystemEndpointsGraphQLController,
} from "./system/SystemEndpointsGraphQLController";
import UserEndpointsGraphQLController, {
    getUserEndpointsGraphQLController,
} from "./user/UserEndpointsGraphQLController";

export default class EndpointsGraphQLController {
    public block: BlockEndpointsGraphQLController = getBlockEndpointsGraphQLController();
    public user: UserEndpointsGraphQLController = getUserEndpointsGraphQLController();
    public note: NotesEndpointsGraphQLController = getNotesEndpointsGraphQLController();
    public comment: CommentsEndpointsGraphQLController = getCommentsEndpointsGraphQLController();
    public sprint: SprintsEndpointsGraphQLController = getSprintsEndpointsGraphQLController();
    public system: SystemEndpointsGraphQLController = getSystemEndpointsGraphQLController();
    public accessControl: AccessControlEndpointsGraphQLController = getAccessControlEndpointsGraphQLController();
}

export const getEndpointsGraphQLController = makeSingletonFunc(
    () => new EndpointsGraphQLController()
);
