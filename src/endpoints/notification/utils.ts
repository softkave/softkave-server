import { INotification } from "../../mongo/notification";
import { IPublicNotificationData } from "./types";

export function toPublicNotificationData(
  notification: INotification
): IPublicNotificationData {
  return {
    customId: notification.customId,
    to: {
      email: notification.to.email,
    },
    body: notification.body,
    from: {
      blockId: notification.from.blockId,
      blockName: notification.from.blockName,
      blockType: notification.from.blockType,
      name: notification.from.name,
      userId: notification.from.userId,
    },
    createdAt: notification.createdAt,
    type: notification.type,
    readAt: notification.readAt,
    expiresAt: notification.expiresAt,
    statusHistory: notification.statusHistory.map((item) => ({
      date: item.date,
      status: item.status,
    })),
    sentEmailHistory: notification.sentEmailHistory.map((item) => ({
      date: item.date,
    })),
  };
}
