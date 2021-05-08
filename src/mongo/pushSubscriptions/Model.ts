import { Connection } from "mongoose";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import pushSubscriptionMongoSchema, {
    IPushSubscriptionDocument,
} from "./definitions";

export interface IPushSubscriptionModel
    extends MongoModel<IPushSubscriptionDocument> {}

const modelName = "push-subscription";
const collectionName = "push-subscriptions";

export const getPushSubscriptionModel = makeSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IPushSubscriptionDocument>({
            modelName,
            collectionName,
            rawSchema: pushSubscriptionMongoSchema,
            connection: conn,
        });
    }
);
