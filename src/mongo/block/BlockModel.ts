import MongoModel, {
  IDerivedMongoModelInitializationProps
} from "../MongoModel";
import blockSchema, { IBlockDocument } from "./definitions";

const modelName = "block-v2";
const collectionName = "blocks-v2";

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
