import { SystemResourceType } from "../../models/system";

const subscriptionResourceTypes: SystemResourceType[] = [
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
