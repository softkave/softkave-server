import {Connection} from 'mongoose';
import {IResource} from '../../models/resource';
import {ClientType} from '../../models/system';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import MongoModel from '../MongoModel';
import {getDefaultMongoConnection} from '../defaultConnection';
import {resourceSchema} from '../definitions';
import {ensureMongoSchemaFields} from '../utils';

export const clientSchemaV1 = 1;

export interface IClientUserEntry {
  userId: string;
  tokenId: string;
  hasUserSeenNotificationsPermissionDialog?: boolean;
  isLoggedIn?: boolean;
  muteChatNotifications?: boolean;
}

export interface IClientUserView extends IClientUserEntry {
  customId: string;
  createdAt: string | Date;
  clientType: ClientType;
  isSubcribedToPushNotifications: boolean;
}

export interface IClientPushNotificationKeys {
  p256dh: string;
  auth: string;
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
export interface IClient extends IResource {
  clientType: ClientType;
  users: Array<IClientUserEntry>;
  endpoint?: string | null;
  keys?: IClientPushNotificationKeys | null;
  pushSubscribedAt?: string;
}

const clientMongoSchema = ensureMongoSchemaFields<IClient>({
  ...resourceSchema,
  clientType: {type: String},
  users: {
    type: [
      ensureMongoSchemaFields<IClientUserEntry>({
        userId: {type: String},
        tokenId: {type: String},
        hasUserSeenNotificationsPermissionDialog: {type: Boolean},
        isLoggedIn: {type: Boolean},
        muteChatNotifications: {type: Boolean, default: false},
      }),
    ],
    default: [],
  },
  endpoint: {type: String, default: null},
  keys: {
    type: ensureMongoSchemaFields<IClientPushNotificationKeys>({
      p256dh: {type: String},
      auth: {type: String},
    }),
    default: null,
  },
  pushSubscribedAt: {type: Date},
});

export type IClientModel = MongoModel<IClient>;

const modelName = 'client_01';
const collectionName = 'clients_01';

export const getClientModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<IClient>({
      modelName,
      collectionName,
      rawSchema: clientMongoSchema,
      connection: conn,
    });
  }
);
