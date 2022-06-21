export type IPublicClient = {
    clientId: string;
    hasUserSeenNotificationsPermissionDialog?: boolean;
    muteChatNotifications?: boolean;
    isSubcribedToPushNotifications?: boolean;
};
