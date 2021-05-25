const pushSubscriptionSchema = `
input SubscribePushSubscriptionKeysInput {
    p256dh: String
    auth: String
}

type GetPushSubscriptionKeys {
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
    getPushSubscriptionKeys: GetPushSubscriptionKeys
    pushSubscriptionExists (
        endpoint: String!, 
        keys: SubscribePushSubscriptionKeysInput!
    ) : PushSubscriptionExistsResult
}
`;

export default pushSubscriptionSchema;
