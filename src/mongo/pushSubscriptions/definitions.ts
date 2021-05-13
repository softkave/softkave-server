import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export interface IPushSubscription {
    customId: string;
    clientId: string;
    createdAt: string;
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

const pushSubscriptionMongoSchema = {
    customId: { type: String, unique: true, index: true },
    clientId: { type: String },
    createdAt: { type: Date, default: getDate },
    endpoint: { type: String },
    keys: {
        type: {
            p256dh: { type: String },
            auth: { type: String },
        },
    },
};

export default pushSubscriptionMongoSchema;

export interface IPushSubscriptionDocument
    extends IPushSubscription,
        Document {}
