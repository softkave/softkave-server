import BlockEndpointsGraphQLController from "./block/BlockEndpointsGraphQLController";
import CommentsEndpointsGraphQLController from "./comments/CommentsEndpointsGraphQLController";
import NotesEndpointsGraphQLController from "./notes/NotesEndpointsGraphQLController";
import SprintsEndpointsGraphQLController from "./sprints/SprintsEndpointsGraphQLController";
import SystemEndpointsGraphQLController from "./system/SystemEndpointsGraphQLController";
import UserEndpointsGraphQLController from "./user/UserEndpointsGraphQLController";

export default class EndpointsGraphQLController {
    public static block: BlockEndpointsGraphQLController = BlockEndpointsGraphQLController;
    public static user: UserEndpointsGraphQLController = UserEndpointsGraphQLController;
    public static note: NotesEndpointsGraphQLController = NotesEndpointsGraphQLController;
    public static comment: CommentsEndpointsGraphQLController = CommentsEndpointsGraphQLController;
    public static sprint: SprintsEndpointsGraphQLController = SprintsEndpointsGraphQLController;
    public static system: SystemEndpointsGraphQLController = SystemEndpointsGraphQLController;
}
