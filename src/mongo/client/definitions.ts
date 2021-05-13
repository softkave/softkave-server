import { Document } from "mongoose";
import { ClientType } from "../../models/system";
import { getDate } from "../../utilities/fns";

export interface IClientUserEntry {
    userId: string;
    tokenId: string;
    hasUserSeenNotificationsPermissionDialog?: boolean;
    isLoggedIn?: boolean;
    muteChatNotifications?: boolean;
}

export interface IClientUserView extends IClientUserEntry {
    customId: string;
    clientId: string;
    createdAt: string;
    clientType: ClientType;
    isSubcribedToPushNotifications?: boolean;
}

export interface IClient {
    customId: string;
    clientId: string;
    createdAt: string;
    clientType: ClientType;
    isSubcribedToPushNotifications?: boolean;
    users: Array<IClientUserEntry>;
}

const clientMongoSchema = {
    customId: { type: String, unique: true, index: true },
    clientId: { type: String },
    createdAt: { type: Date, default: getDate },
    clientType: { type: String },
    isSubcribedToPushNotifications: { type: Boolean },
    users: {
        type: [
            {
                userId: { type: String },
                tokenId: { type: String },
                hasUserSeenNotificationsPermissionDialog: { type: Boolean },
                isLoggedIn: { type: Boolean },
                muteChatNotifications: { type: Boolean, default: false },
            },
        ],
        default: [],
    },
};

export default clientMongoSchema;

export interface IClientDocument extends IClient, Document {}
