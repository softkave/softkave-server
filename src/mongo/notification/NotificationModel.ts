import { Connection } from "mongoose";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import notificationSchema, { INotificationDocument } from "./definitions";

const modelName = "notification";
const collectionName = "notifications";

let notificationModel: INotificationModel = null;

export function getNotificationModel(
  conn: Connection = getDefaultConnection().getConnection()
) {
  if (notificationModel) {
    return notificationModel;
  }

  notificationModel = new MongoModel<INotificationDocument>({
    modelName,
    collectionName,
    rawSchema: notificationSchema,
    connection: conn,
  });

  return notificationModel;
}

export interface INotificationModel extends MongoModel<INotificationDocument> {}
