// RoleCreated = "roleCreated",
// RoleUpdated = "roleUpdated",
// RoleDeleted = "roleDeleted",

import { INotification, NotificationType } from "../../../mongo/notification";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";

export function rolesUpdatedNotification() {
    const title = ``;
    const type = NotificationType.ResourceRolesUpdated;
    const body = "";
    const notification: INotification = {
        title,
        body,
        type,
        customId: getNewId(),
        recipientId: "",
        orgId: "",
        subscriptionResourceId: "",
        subscriptionResourceType: "",
        subscriptionId: "",
        primaryResourceType: "",
        primaryResourceId: "",
        createdAt: getDate(),
        readAt: "",
        sentEmailHistory: [],
        attachments: [],
        actions: [],
        meta: [],
        reason: "",
    };

    return notification;
}
