const MongoModel = require("./MongoModel");

const accessControlSchema = {
  organizationID: { type: String, unique: true },
  actionName: { type: String, index: true },
  permittedRoles: { type: [String], index: true }
};

const modelName = "access-control";
const collectionName = "access-control";

class AccessControlModel extends MongoModel {
  constructor({ connection }) {
    super({
      connection,
      modelName,
      collectionName,
      rawSchema: accessControlSchema
    });
  }
}

module.exports = AccessControlModel;
