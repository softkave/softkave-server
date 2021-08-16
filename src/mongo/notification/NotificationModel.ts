import { Connection } from "mongoose";
import getSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import { INotificationDocument, notificationSchema } from "./definitions";

const modelName = "notification-v3";
const collectionName = "notifications-v3";

export const getNotificationModel = getSingletonFunc(
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
