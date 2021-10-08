import makeSingletonFn from "../../utilities/createSingletonFunc";
import { INotificationContext } from "../contexts/NotificationContext";
import { notImplementFn } from "./utils";

class TestNotificationContext implements INotificationContext {
    // Notifications
    getNotificationById = notImplementFn;
    getUserNotificationsById = notImplementFn;
    getUserNotifications = notImplementFn;
    updateNotificationById = notImplementFn;
    deleteNotificationById = notImplementFn;
    bulkSaveNotifications = notImplementFn;
    getNotificationsByOrganizationId = notImplementFn;
    markUserNotificationsRead = notImplementFn;

    // Notification subscriptions
    getNotificationSubscriptionById = notImplementFn;
    updateNotificationSubscriptionById = notImplementFn;
    bulkSaveNotificationSubscriptions = notImplementFn;
    getNotificationSubscriptionsByResourceId = notImplementFn;
}

export const getTestNotificationContext = makeSingletonFn(
    () => new TestNotificationContext()
);
