const endpointSchema = `
    type Query {
        user: UserQuery
        block: BlockQuery
        sprint: SprintQuery
        system: SystemQuery
    }

    type Mutation {
        user: UserQuery
        block: BlockQuery
        sprint: SprintQuery
        system: SystemQuery
    }
`;

export default endpointSchema;
