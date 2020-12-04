import {
    INotification,
    INotificationSubscription,
} from "../../mongo/notification";
import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import {
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
