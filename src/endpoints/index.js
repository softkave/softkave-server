const { buildSchema } = require("graphql");
const { blockSchema, BlockOperations } = require("./block");
const { userSchema, UserOperations } = require("./user");
const indexSchema = require("./schema");
const { utilitySchema } = require("../utils/schema-utils");

class IndexOperations {
  constructor(params) {
    this.staticParams = params;
  }

  async user() {
    return new UserOperations(this.staticParams);
  }

  async block() {
    return new BlockOperations(this.staticParams);
  }
}

const rootSchema = `
  ${utilitySchema}
  ${userSchema}
  ${blockSchema}
  ${indexSchema}
`;

const compiledSchema = buildSchema(rootSchema);

module.exports = {
  IndexOperations,
  indexSchema: compiledSchema
};
