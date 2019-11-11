import MongoModel, {
  IDerivedMongoModelInitializationProps
} from "../MongoModel";
import userSchema, { IUserDocument } from "./definitions";

const modelName = "user";
const collectionName = "users";

class UserModel extends MongoModel<IUserDocument> {
  constructor({ connection }: IDerivedMongoModelInitializationProps) {
    super({
      connection,
      modelName,
      collectionName,
      rawSchema: userSchema
    });
  }
}

export default UserModel;
