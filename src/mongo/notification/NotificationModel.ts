import MongoModel, { IBaseMongoModelParameters } from "../MongoModel";
import notificationSchema from "./schema";

const modelName = "notification";
const collectionName = "notifications";

class NotificationModel extends MongoModel {
  constructor({ connection }: IBaseMongoModelParameters) {
    super({
      connection,
      modelName,
      collectionName,
      rawSchema: notificationSchema
    });
  }
}

export default NotificationModel;
