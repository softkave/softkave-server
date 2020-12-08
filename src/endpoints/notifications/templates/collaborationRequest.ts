import { SystemResourceType } from "../../../models/system";
import { IBlock } from "../../../mongo/block";
import {
    CollaborationRequestResponse,
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from "../../../mongo/collaborationRequest";
import { INotification, NotificationType } from "../../../mongo/notification";
import { IUser } from "../../../mongo/user";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";

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

export function getCollaborationRequestResponseNotification(
    req: ICollaborationRequest,
    response: CollaborationRequestResponse,
    collaborator: IUser,
    senderId: string
) {
    const responseTxt =
        response === CollaborationRequestStatusType.Accepted
            ? "accepted"
            : "declined";
    const title = `Collaboration request ${responseTxt}`;
    const type = NotificationType.CollaborationRequestResponse;
    const body = `This is to notify you that ${collaborator.name} ${responseTxt} the request you sent.`;
    const notification: INotification = {
        title,
        body,
        type,
        customId: getNewId(),
        recipientId: senderId,
        orgId: req.from.blockId,
        createdAt: getDate(),
        attachments: [
            {
                resourceId: req.customId,
                resourceType: SystemResourceType.CollaborationRequest,
            },
        ],
    };

    return notification;
}
