import { Connection } from "mongoose";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import {
    INotificationSubscriptionDocument,
    notificationSubscriptionSchema,
} from "./definitions";

const modelName = "notificationSubscription";
const collectionName = "notificationSubscriptions";

export const getNotificationSubscriptionModel = makeSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<INotificationSubscriptionDocument>({
            modelName,
            collectionName,
            rawSchema: notificationSubscriptionSchema,
            connection: conn,
        });
    }
);

export interface INotificationSubscriptionModel
    extends MongoModel<INotificationSubscriptionDocument> {}
