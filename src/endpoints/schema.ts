const endpointSchema = `
    type Query {
        user: UserQuery
        block: BlockQuery
        sprint: SprintQuery
        system: SystemQuery
        pushSubscription: PushSubscriptionQuery
    }

    type Mutation {
        user: UserQuery
        block: BlockQuery
        sprint: SprintQuery
        system: SystemQuery
        pushSubscription: PushSubscriptionQuery
    }
`;

export default endpointSchema;
