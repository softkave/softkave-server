const pushSubscriptionSchema = `
input SubscribePushSubscriptionKeysInput {
    p256dh: String
    auth: String
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
    ) : PushSubscriptionExistsResult
}
`;

export default pushSubscriptionSchema;
