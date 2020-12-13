import {
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from "../../mongo/collaboration-request";
import {
    INotification,
    INotificationSubscription,
} from "../../mongo/notification";
import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import {
    IPublicCollaborationRequest,
    IPublicNotificationData,
    IPublicNotificationSubscription,
} from "./types";

const publicNotificationFields = getFields<IPublicNotificationData>({});

export function getPublicNotificationData(
    notification: Partial<INotification>
): IPublicNotificationData {
    return extractFields(notification, publicNotificationFields);
}

export function getPublicNotificationsArray(
    notifications: Array<Partial<INotification>>
): IPublicNotificationData[] {
    return notifications.map((notification) =>
        extractFields(notification, publicNotificationFields)
    );
}

const publicNotificationSubscriptionFields = getFields<IPublicNotificationSubscription>(
    {}
);

export function getPublicNotificationSubscriptionData(
    subscription: Partial<INotificationSubscription>
): IPublicNotificationSubscription {
    return extractFields(subscription, publicNotificationSubscriptionFields);
}

export function getPublicNotificationSubscriptionsArray(
    subscriptions: Array<Partial<INotificationSubscription>>
): IPublicNotificationSubscription[] {
    return subscriptions.map((subscription) =>
        extractFields(subscription, publicNotificationSubscriptionFields)
    );
}

const publicCollaborationRequestFields = getFields<IPublicCollaborationRequest>(
    {
        customId: true,
        to: {
            email: true,
        },
        body: true,
        from: {
            userId: true,
            name: true,
            blockId: true,
            blockName: true,
            blockType: true,
        },
        createdAt: getDateString,
        readAt: getDateString,
        expiresAt: getDateString,
        statusHistory: {
            status: true,
            date: getDateString,
        },
        sentEmailHistory: {
            date: getDateString,
        },
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
