import MongoModel, { IBaseMongoModelParameters } from "../MongoModel";
import accessControlSchema from "./schema";

const modelName = "access-control";
const collectionName = "access-control";

class AccessControlModel extends MongoModel {
  constructor({ connection }: IBaseMongoModelParameters) {
    super({
      connection,
      modelName,
      collectionName,
      rawSchema: accessControlSchema
    });
  }
}

export default AccessControlModel;
