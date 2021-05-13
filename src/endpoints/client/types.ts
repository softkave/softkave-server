export type IPublicClient = {
    clientId: string;
    hasUserSeenNotificationsPermissionDialog?: boolean;
    isLoggedIn?: boolean;
    muteChatNotifications?: boolean;
    isSubcribedToPushNotifications?: boolean;
};
