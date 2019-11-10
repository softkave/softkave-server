import MongoModel, {
  IDerivedMongoModelInitializationProps
} from "../MongoModel";
import notificationSchema, { INotificationDocument } from "./definitions";

const modelName = "notification";
const collectionName = "notifications";

class NotificationModel extends MongoModel<INotificationDocument> {
  constructor({ connection }: IDerivedMongoModelInitializationProps) {
    super({
      connection,
      modelName,
      collectionName,
      rawSchema: notificationSchema
    });
  }
}

export default NotificationModel;
