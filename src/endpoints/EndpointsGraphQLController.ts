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
import { getNotificationEndpointsGraphQLController } from "./notifications";
import NotificationEndpointsGraphQLController from "./notifications/NotificationEndpointsGraphQLController";
import PushSubscriptionsEndpointsGraphQLController, {
    getPushSubscriptionsEndpointsGraphQLController,
} from "./pushSubscription/PushSubscriptionEndpointsGraphQLController";
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
    public block: BlockEndpointsGraphQLController =
        getBlockEndpointsGraphQLController();
    public user: UserEndpointsGraphQLController =
        getUserEndpointsGraphQLController();
    public comment: CommentsEndpointsGraphQLController =
        getCommentsEndpointsGraphQLController();
    public sprint: SprintsEndpointsGraphQLController =
        getSprintsEndpointsGraphQLController();
    public system: SystemEndpointsGraphQLController =
        getSystemEndpointsGraphQLController();
    public accessControl: AccessControlEndpointsGraphQLController =
        getAccessControlEndpointsGraphQLController();
    public notifications: NotificationEndpointsGraphQLController =
        getNotificationEndpointsGraphQLController();
    public pushSubscription: PushSubscriptionsEndpointsGraphQLController =
        getPushSubscriptionsEndpointsGraphQLController();
}

export const getEndpointsGraphQLController = makeSingletonFunc(
    () => new EndpointsGraphQLController()
);
