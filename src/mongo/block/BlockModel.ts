import MongoModel, {
  IDerivedMongoModelInitializationProps
} from "../MongoModel";
import blockSchema, { IBlockDocument } from "./definitions";

const modelName = "block";
const collectionName = "blocks";

class BlockModel extends MongoModel<IBlockDocument> {
  constructor({ connection }: IDerivedMongoModelInitializationProps) {
    super({
      connection,
      modelName,
      collectionName,
      rawSchema: blockSchema
    });
  }
}

export default BlockModel;
