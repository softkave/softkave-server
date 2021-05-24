import makeSingletonFunc from "../../utilities/createSingletonFunc";
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
    getNotificationsByOrgId = notImplementFn;
    markUserNotificationsRead = notImplementFn;

    // Notification subscriptions
    getNotificationSubscriptionById = notImplementFn;
    updateNotificationSubscriptionById = notImplementFn;
    bulkSaveNotificationSubscriptions = notImplementFn;
    getNotificationSubscriptionsByResourceId = notImplementFn;
}

export const getTestNotificationContext = makeSingletonFunc(
    () => new TestNotificationContext()
);