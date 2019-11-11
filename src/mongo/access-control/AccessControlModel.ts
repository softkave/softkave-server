import MongoModel, {
  IDerivedMongoModelInitializationProps
} from "../MongoModel";
import accessControlSchema, { IAccessControlDocument } from "./definitions";

const modelName = "access-control";
const collectionName = "access-control";

class AccessControlModel extends MongoModel<IAccessControlDocument> {
  constructor({ connection }: IDerivedMongoModelInitializationProps) {
    super({
      connection,
      modelName,
      collectionName,
      rawSchema: accessControlSchema
    });
  }
}

export default AccessControlModel;
