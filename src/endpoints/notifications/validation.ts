import Joi from "joi";
import { NotificationReason, NotificationType } from "../../mongo/notification";
import { notificationConstants } from "./constants";

const subscriptionResourceType = Joi.string().valid(
    ...notificationConstants.subscriptionResourceTypes
);

const reasonsArr: NotificationReason[] = [
    NotificationReason.AddedByUser,
    NotificationReason.UserCreatedResource,
    NotificationReason.WasAssignedTask,
    NotificationReason.WasAutoAssignedTask,
    NotificationReason.UserIsResourceRecipient,
];

const notificationReason = Joi.string().valid(...reasonsArr);

const typeArr: NotificationType[] = [
    // NotificationType.OrganizationDeleted,

    NotificationType.CollaboratorRemoved,
    NotificationType.CollaboratorPermissionsUpdated,
    NotificationType.CollaboratorPermissionGroupsUpdated,

    NotificationType.PermissionsUpdated,
    NotificationType.ResourcePermissionGroupsUpdated,

    NotificationType.NewCollaborationRequest,
    NotificationType.CollaborationRequestResponse,
    NotificationType.CollaborationRequestUpdated,
    NotificationType.CollaborationRequestRevoked,

    NotificationType.TaskAssigned,
    NotificationType.TaskUnassigned,
];

const notificationType = Joi.string().valid(...typeArr);

const notificationsValidationSchemas = {
    notificationReason,
    subscriptionResourceType,
    notificationType,
};

export default notificationsValidationSchemas;
