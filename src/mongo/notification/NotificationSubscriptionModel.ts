import { Connection } from "mongoose";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import {
    INotificationSubscriptionDocument,
    notificationSubscriptionSchema,
} from "./definitions";

const modelName = "notification-subscription";
const collectionName = "notification-subscriptions";

export const getNotificationSubscriptionModel = makeSingletonFn(
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
