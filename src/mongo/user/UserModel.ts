import MongoModel, { IBaseMongoModelParameters } from "../MongoModel";
import userSchema from "./schema";

const modelName = "user";
const collectionName = "users";

class UserModel extends MongoModel {
  constructor({ connection }: IBaseMongoModelParameters) {
    super({
      connection,
      modelName,
      collectionName,
      rawSchema: userSchema
    });
  }
}

export default UserModel;
