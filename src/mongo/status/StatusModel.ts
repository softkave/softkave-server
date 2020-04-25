import MongoModel, {
  IDerivedMongoModelInitializationProps,
} from "../MongoModel";
import { IStatusDocument, statusSchema } from "./definitions";

const modelName = "status";
const collectionName = "statuses";

class StatusModel extends MongoModel<IStatusDocument> {
  constructor({ connection }: IDerivedMongoModelInitializationProps) {
    super({
      connection,
      modelName,
      collectionName,
      rawSchema: statusSchema,
    });
  }
}

export default StatusModel;
