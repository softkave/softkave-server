import { INotification, NotificationType } from "../../../mongo/notification";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";

export function boardUpdatedNotification() {
    const title = ``;
    const type = NotificationType.BoardUpdated;
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
