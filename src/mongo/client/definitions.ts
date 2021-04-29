import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export interface IClient {
    customId: string;
    userId: string;
    createdAt: string;
    hasNotificationsAPI?: boolean;
    grantedNotificationsPermission?: boolean;
}

const clientMongoSchema = {
    customId: { type: String, unique: true, index: true },
    userId: { type: String },
    createdAt: { type: Date, default: getDate },
    hasNotificationsAPI: { type: Boolean },
    grantedNotificationsPermission: { type: Boolean },
};

export default clientMongoSchema;

export interface IClientDocument extends IClient, Document {}
