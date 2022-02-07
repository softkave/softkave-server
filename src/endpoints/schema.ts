const endpointSchema = `
    type Query {
        user: UserQuery
        sprint: SprintQuery
        pushSubscription: PushSubscriptionQuery
    }

    type Mutation {
        user: UserMutation
        sprint: SprintMutation
        system: SystemMutation
        client: ClientMutation
        pushSubscription: PushSubscriptionQuery
    }
`;

export default endpointSchema;
