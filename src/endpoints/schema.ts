const endpointSchema = `
  type Query {
    user: UserQuery
    block: BlockQuery
  }

  type Mutation {
    user: UserQuery
    block: BlockQuery
  }
`;

export default endpointSchema;
