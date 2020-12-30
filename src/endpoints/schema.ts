const endpointSchema = `
    type Query {
        user: UserQuery
        block: BlockQuery
        note: NoteQuery
        sprint: SprintQuery
        system: SystemQuery
        accessControl: AccessControlQuery
        notifications: NotificationsQuery
    }

    type Mutation {
        user: UserQuery
        block: BlockQuery
        note: NoteQuery
        sprint: SprintQuery
        system: SystemQuery
        accessControl: AccessControlMutation
        notifications: NotificationsMutation
    }
`;

export default endpointSchema;
