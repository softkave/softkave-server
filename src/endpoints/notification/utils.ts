import { INotification } from "../../mongo/notification";
import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { IPublicNotificationData } from "./types";

const publicNotificationFields = getFields<IPublicNotificationData>({
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
    type: true,
    readAt: getDateString,
    expiresAt: getDateString,
    statusHistory: {
        status: true,
        date: getDateString,
    },
    sentEmailHistory: {
        date: getDateString,
    },
});

export function getPublicNotificationData(
    notification: INotification
): IPublicNotificationData {
    return extractFields(notification, publicNotificationFields);
}

export function getPublicNotificationsArray(
    notifications: INotification[]
): IPublicNotificationData[] {
    return notifications.map((notification) =>
        extractFields(notification, publicNotificationFields)
    );
}
