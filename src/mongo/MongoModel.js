const { Schema } = require("mongoose");

class MongoModel {
  constructor({ connection, rawSchema, modelName, collectionName }) {
    this.connection = connection;
    this.rawSchema = rawSchema;
    this.schema = new Schema(rawSchema);
    this.modelName = modelName;
    this.collectionName = collectionName;
    this.model = this.newModel();
  }

  newModel() {
    return this.connection(this.modelName, this.schema, this.collectionName);
  }
}

module.exports = MongoModel;
