import { INotification, NotificationType } from "../../../mongo/notification";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";

export function collaboratorRemovedNotification() {
    const title = ``;
    const type = NotificationType.CollaboratorRemoved;
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
        annotations: [],
        actions: [],
        meta: [],
        reason: "",
    };

    return notification;
}

export function collaboratorPermissionsUpdatedNotification() {
    const title = ``;
    const type = NotificationType.CollaboratorPermissionsUpdated;
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
        annotations: [],
        actions: [],
        meta: [],
        reason: "",
    };

    return notification;
}

export function collaboratorRolesUpdatedNotification() {
    const title = ``;
    const type = NotificationType.CollaboratorRolesUpdated;
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
        annotations: [],
        actions: [],
        meta: [],
        reason: "",
    };

    return notification;
}
