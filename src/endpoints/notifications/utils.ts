import { INotificationSubscription } from "../../mongo/notification";
import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { IPublicNotificationSubscription } from "./types";

const publicNotificationSubscriptionFields =
    getFields<IPublicNotificationSubscription>({
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
    });

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
