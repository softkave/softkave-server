import MongoModel, { IBaseMongoModelParameters } from "../MongoModel";
import blockSchema from "./schema";

const modelName = "block";
const collectionName = "blocks";

class BlockModel extends MongoModel {
  constructor({ connection }: IBaseMongoModelParameters) {
    super({
      connection,
      modelName,
      collectionName,
      rawSchema: blockSchema
    });
  }
}

export default BlockModel;
