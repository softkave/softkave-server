import { Document } from "mongoose";
import { ClientType } from "../../models/system";
import { getDate } from "../../utilities/fns";

export interface IClient {
    customId: string;
    userId: string;
    clientId: string;
    createdAt: string;
    updatedAt?: string;
    clientType: ClientType;
    tokenId: string;
    hasUserSeenNotificationsPermissionDialog?: boolean;
    muteChatNotifications?: boolean;
    isSubcribedToPushNotifications?: boolean;
}

const clientMongoSchema = {
    customId: { type: String, unique: true, index: true },
    userId: { type: String },
    clientId: { type: String },
    createdAt: { type: Date, default: getDate },
    updatedAt: { type: Date },
    clientType: { type: String },
    tokenId: { type: String },
    hasUserSeenNotificationsPermissionDialog: { type: Boolean },
    muteNotifications: { type: Boolean },
    isSubcribedToPushNotifications: { type: Boolean },
};

export default clientMongoSchema;

export interface IClientDocument extends IClient, Document {}
