const endpointSchema = `
    type Query {
        user: UserQuery
        block: BlockQuery
        note: NoteQuery
        sprint: SprintQuery
    }

    type Mutation {
        user: UserQuery
        block: BlockQuery
        note: NoteQuery
        sprint: SprintQuery
    }
`;

export default endpointSchema;
