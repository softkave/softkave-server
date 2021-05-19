const pushSubscriptionSchema = `
input SubscribePushSubscriptionKeysInput {
    p256dh: string;
    auth: string;
}

type GetPushNotificationKeys {
    errors: [Error]
    vapidPublicKey: String
}

type PushSubscriptionExistsResult {
    errors: [Error]
    exists: Boolean
}

type PushSubscriptionQuery {
    subscribePushSubscription (
        endpoint: String!, 
        keys: SubscribePushSubscriptionKeysInput!
    ) : ErrorOnlyResponse
    unsubscribePushSubscription: ErrorOnlyResponse
    getPushNotificationKeys: GetPushNotificationKeys
    pushSubscriptionExists (
        endpoint: String!, 
        keys: SubscribePushSubscriptionKeysInput!
    ) : PushSubscriptionExistsResulte
}
`;

export default pushSubscriptionSchema;
