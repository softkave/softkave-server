const pushSubscriptionSchema = `
input SubscribePushSubscriptionKeysInput {
    p256dh: string;
    auth: string;
}

type PushSubscriptionQuery {
    subscribePushSubscription: (endpoint: String!, keys: SubscribePushSubscriptionKeysInput!) => 
        ErrorOnlyResponse
    unsubscribePushSubscription: () => ErrorOnlyResponse
}
`;

export default pushSubscriptionSchema;
