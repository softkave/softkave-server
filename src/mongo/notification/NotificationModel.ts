import { Connection } from "mongoose";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import { INotificationDocument, notificationSchema } from "./definitions";

const modelName = "notification";
const collectionName = "notifications";

export const getNotificationModel = makeSingletonFunc(
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
