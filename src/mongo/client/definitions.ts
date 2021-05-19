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
    clientId: string;
    createdAt: string;
    clientType: ClientType;
    isSubcribedToPushNotifications: boolean;
}

// TODO: can we implement a more efficient system where we use
// the user's browser's hashed push subscription endpoint as clientId
// which is more reliable. Problem is when the user's browser doesn't
// support web workers or push notification. We could just require
// they use a browser that suppoer them.

// TODO: should we store if we have permission to show notifications

// TODO: we should mute notifications for the user if they set permissions
// to "denied" and someone else grants the permission. The others should be
// fine, but the original user should have notifications turned off.
// OR we can fingerprint the browsers
export interface IClient {
    clientId: string;
    createdAt: string;
    clientType: ClientType;
    users: Array<IClientUserEntry>;
    endpoint?: string;
    keys?: {
        p256dh: string;
        auth: string;
    };
    pushSubscribedAt?: string;
}

const clientMongoSchema = {
    clientId: { type: String },
    createdAt: { type: Date, default: getDate },
    clientType: { type: String },
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
    endpoint: { type: String, default: null },
    keys: {
        type: {
            p256dh: { type: String },
            auth: { type: String },
        },
        default: null,
    },
    pushSubscribedAt: { type: Date },
};

export default clientMongoSchema;

export interface IClientDocument extends IClient, Document {}
