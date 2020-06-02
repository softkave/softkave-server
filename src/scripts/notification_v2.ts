import { Connection, Document } from "mongoose";
import { getDefaultConnection } from "../mongo/defaultConnection";
import MongoModel from "../mongo/MongoModel";
import {
  getNotificationModel,
  INotification,
  INotification0,
  notificationSchema0,
} from "../mongo/notification";

let not0Model: MongoModel = null;

export function getNotification0Model(conn: Connection) {
  if (not0Model) {
    return not0Model;
  }

  not0Model = new MongoModel({
    modelName: "notification",
    collectionName: "notifications",
    rawSchema: notificationSchema0,
    connection: conn,
  });

  return not0Model;
}

export async function oldNotificationToNewNotification() {
  console.log(`script - oldNotificationToNewNotification - started`);

  let docsCount = 0;
  const notification0Model = getNotification0Model(
    getDefaultConnection().getConnection()
  );
  await notification0Model.model.ensureIndexes();
  const cursor = notification0Model.model.find({}).cursor();
  const notificationModel = getNotificationModel(
    getDefaultConnection().getConnection()
  );
  await notificationModel.model.ensureIndexes();

  try {
    for (
      let doc: INotification0 & Document = await cursor.next();
      doc !== null;
      doc = await cursor.next()
    ) {
      const notification: INotification = {
        customId: doc.customId,
        to: doc.to,
        body: doc.body,
        from: doc.from,
        createdAt: new Date(doc.createdAt).toString(),
        type: doc.type,
        readAt: doc.readAt ? new Date(doc.readAt).toString() : undefined,
        expiresAt: doc.expiresAt
          ? new Date(doc.expiresAt).toString()
          : undefined,
        statusHistory: doc.statusHistory.map((status) => ({
          status: status.status,
          date: new Date(status.date).toString(),
        })),
        sentEmailHistory: doc.sentEmailHistory.map((item) => ({
          date: new Date(item.date).toString(),
        })),
      };

      const newDoc = new notificationModel.model(notification);
      await newDoc.save();

      docsCount++;
    }

    cursor.close();
    console.log(`doc(s) count = ${docsCount}`);
    console.log(`script - oldNotificationToNewNotification - completed`);
  } catch (error) {
    console.log(`script - oldNotificationToNewNotification - error`);
    console.log("- - - - -");
    console.error(error);
    console.log("- - - - -");
  }
}
