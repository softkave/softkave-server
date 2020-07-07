const endpointSchema = `
  type Query {
    user: UserQuery
    block: BlockQuery
    note: NoteQuery
  }

  type Mutation {
    user: UserQuery
    block: BlockQuery
    note: NoteQuery
  }
`;

export default endpointSchema;
