const { Schema } = require("mongoose");

function makeModel(conn, rawSchema, modelName, collName) {
  const schema = new Schema(rawSchema);
  const model = newModel();

  function newModel() {
    return conn.model(modelName, schema, collName);
  }

  return {
    schema,
    model,
    newModel,
    rawSchema,
    connection: conn
  };
}

module.exports = makeModel;
