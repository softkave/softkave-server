import {
    ICollaborationRequest,
    CollaborationRequestStatusType,
} from "../../mongo/collaboration-request";
import { getDateString, getDateStringIfExists } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { IPublicCollaborationRequest } from "./types";

const publicCollaborationRequestFields = getFields<IPublicCollaborationRequest>(
    {
        customId: true,
        to: {
            email: true,
        },
        from: {
            userId: true,
            name: true,
            blockId: true,
            blockName: true,
            blockType: true,
        },
        createdAt: getDateString,
        readAt: getDateStringIfExists,
        statusHistory: {
            status: true,
            date: getDateString,
        },
        sentEmailHistory: {
            reason: true,
            date: getDateString,
        },
        title: true,
        body: true,
        expiresAt: getDateStringIfExists,
    }
);

export function getPublicCollaborationRequest(
    notification: Partial<ICollaborationRequest>
): IPublicCollaborationRequest {
    return extractFields(notification, publicCollaborationRequestFields);
}

export function getPublicCollaborationRequestArray(
    notifications: Array<Partial<ICollaborationRequest>>
): IPublicCollaborationRequest[] {
    return notifications.map((notification) =>
        extractFields(notification, publicCollaborationRequestFields)
    );
}

export function isCollaborationRequestAccepted(request: ICollaborationRequest) {
    if (Array.isArray(request.statusHistory)) {
        return !!request.statusHistory.find((status) => {
            return status.status === CollaborationRequestStatusType.Accepted;
        });
    }

    return false;
}

export function isRequestAccepted(request: ICollaborationRequest) {
    if (Array.isArray(request.statusHistory)) {
        return !!request.statusHistory.find((status) => {
            return status.status === CollaborationRequestStatusType.Accepted;
        });
    }

    return false;
}
