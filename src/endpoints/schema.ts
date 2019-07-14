const indexSchema = `
  type Query {
    user: UserQuery
    block: BlockQuery
  }

  type Mutation {
    user: UserQuery
    block: BlockQuery
  }
`;

module.exports = indexSchema;
export {};
