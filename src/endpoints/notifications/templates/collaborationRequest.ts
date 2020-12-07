import { SystemResourceType } from "../../../models/system";
import { IBlock } from "../../../mongo/block";
import { ICollaborationRequest } from "../../../mongo/collaborationRequest";
import { INotification, NotificationType } from "../../../mongo/notification";
import { IUser } from "../../../mongo/user";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";

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
        attachments: [],
        actions: [],
        meta: [],
        reason: "",
    };

    return notification;
}

export function getCollaborationRequestRevokedNotification(
    org: IBlock,
    user: IUser,
    request: ICollaborationRequest
) {
    const title = `Collaboration request from ${org.name} revoked`;
    const type = NotificationType.CollaborationRequestRevoked;
    const body =
        // `Hi ${user.name},` +
        `This is to notify you that the collaboration request from ${org.name} has been revoked.`;

    const notification: INotification = {
        title,
        body,
        type,
        customId: getNewId(),
        recipientId: user.customId,
        createdAt: getDate(),
        attachments: [
            {
                resourceId: request.customId,
                resourceType: SystemResourceType.CollaborationRequest,
            },
        ],
    };

    return notification;
}

export function getCollaborationRequestResponseNotification() {
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
        attachments: [],
        actions: [],
        meta: [],
        reason: "",
    };

    return notification;
}
