import { IBlock } from "../../../mongo/block";
import { ICollaborationRequest } from "../../../mongo/collaborationRequest";
import { INotification, NotificationType } from "../../../mongo/notification";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";

export function newCollaborationRequestToUserNotification(
    request: ICollaborationRequest,
    org: IBlock
) {
    const title = `New collaboration request from ${org.name}`;
    const type = NotificationType.NewCollaborationRequest;
    const body = request.body; // get body, and remove it from request
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

export function newCollaborationRequestSentNotification(
    request: ICollaborationRequest,
    org: IBlock
) {
    const title = `New collaboration request from ${org.name}`;
    const type = NotificationType.NewCollaborationRequest;
    const body = request.body; // get body, and remove it from request
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

export function collaborationRequestUpdatedNotification() {
    const title = ``;
    const type = NotificationType.CollaborationRequestUpdated;
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

export function collaborationRequestRevokedNotification() {
    const title = ``;
    const type = NotificationType.CollaborationRequestRevoked;
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

export function collaborationRequestResponseNotification() {
    const title = ``;
    const type = NotificationType.CollaborationRequestResponse;
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
