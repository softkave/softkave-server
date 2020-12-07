import { SystemResourceType } from "../../models/system";
import { SubscriptionResourceTypes } from "./updateResourceSubscriptions/types";

const subscriptionResourceTypes: SubscriptionResourceTypes[] = [
    SystemResourceType.Org,
    SystemResourceType.Board,
    SystemResourceType.Task,
    SystemResourceType.CollaborationRequest,
];

export const notificationConstants = {
    subscriptionResourceTypes,
    maxAddCollaboratorMessageLength: 500,
    maxMarkNotificationsReadNum: 200,
    maxUpdateResourceSubscriptionsNum: 10,
};
