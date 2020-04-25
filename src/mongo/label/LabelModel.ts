import MongoModel, {
  IDerivedMongoModelInitializationProps,
} from "../MongoModel";
import { ILabelDocument, labelSchema } from "./definitions";

const modelName = "label";
const collectionName = "labels";

class LabelModel extends MongoModel<ILabelDocument> {
  constructor({ connection }: IDerivedMongoModelInitializationProps) {
    super({
      connection,
      modelName,
      collectionName,
      rawSchema: labelSchema,
    });
  }
}

export default LabelModel;
