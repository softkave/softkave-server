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

const publicNotificationFields = getFields<IPublicNotificationData>({
    customId: true,
    recipientId: true,
    body: true,
    type: true,
    title: true,
    orgId: true,
    subscriptionResourceId: true,
    subscriptionResourceType: true,
    subscriptionId: true,
    primaryResourceType: true,
    primaryResourceId: true,
    createdAt: getDateString,
    readAt: getDateString,
    sentEmailHistory: {
        date: getDateString,
    },
    attachments: {
        resourceType: true,
        resourceId: true,
        places: { start: true, end: true },
        text: true,
    },
    actions: true,
    meta: true,
    reason: true,
});

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
    {
        customId: true,
        recipients: {
            userId: true,
            reason: true,
            addedBy: true,
            addedAt: getDateString,
        },
        resourceType: true,
        resourceId: true,
        type: true,
        orgId: true,
    }
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
        from: {
            userId: true,
            name: true,
            blockId: true,
            blockName: true,
            blockType: true,
        },
        createdAt: getDateString,
        readAt: getDateString,
        statusHistory: {
            status: true,
            date: getDateString,
        },
        sentEmailHistory: {
            reason: true,
            date: getDateString,
        },
        title: true,
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
