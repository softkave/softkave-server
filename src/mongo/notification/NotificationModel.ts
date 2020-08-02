import { Connection } from "mongoose";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import notificationSchema, { INotificationDocument } from "./definitions";

const modelName = "notification-v2";
const collectionName = "notifications-v2";

export const getNotificationModel = createSingletonFunc(
  (conn: Connection = getDefaultConnection().getConnection()) => {
    return new MongoModel<INotificationDocument>({
      modelName,
      collectionName,
      rawSchema: notificationSchema,
      connection: conn,
    });
  }
);

export interface INotificationModel extends MongoModel<INotificationDocument> {}
