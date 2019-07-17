"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = indexSchema;
//# sourceMappingURL=schema.js.map