const endpointSchema = `
    type Query {
        user: UserQuery
        block: BlockQuery
        note: NoteQuery
        sprint: SprintQuery
        system: SystemQuery
        accessControl: AccessControlQuery
    }

    type Mutation {
        user: UserQuery
        block: BlockQuery
        note: NoteQuery
        sprint: SprintQuery
        system: SystemQuery
        accessControl: AccessControlQuery
    }
`;

export default endpointSchema;
