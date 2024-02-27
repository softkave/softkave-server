import {Connection, SchemaTypes} from 'mongoose';
import {IResource} from '../../models/resource';
import {SystemResourceType} from '../../models/system';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {getDate} from '../../utilities/fns';
import MongoModel from '../MongoModel';
import {getDefaultMongoConnection} from '../defaultConnection';
import {resourceSchema, workspaceResourceSchema} from '../definitions';
import {ensureMongoSchemaFields} from '../utils';

export interface INotificationEmailHistoryItem {
  date: Date;
}

export const notificationEmailHistorySchema = {
  date: {type: Date},
};

export enum NotificationType {
  // Collaboration request
  CollaborationRequestReminder = 'collaborationRequestReminder',
  CollaborationRequestResponse = 'collaborationRequestResponse',
  CollaborationRequestUpdated = 'collaborationRequestUpdated',
  CollaborationRequestRevoked = 'collaborationRequestRevoked',

  // Task
  TaskAssigned = 'taskAssigned',
  TaskUnassigned = 'taskUnassigned',
  TaskCompleted = 'taskCompleted',
  TaskUpdated = 'taskUpdated',

  // Chat
  UnseenChats = 'unseenChats',
}

export interface INotificationResourceAttachment {
  resourceType: SystemResourceType;
  resourceId: string;
}

export interface INotification extends IResource {
  recipientEmail: string;
  recipientId?: string;
  bodyText: string;
  bodyDelta: any;
  type: NotificationType;
  title: string;
  workspaceId?: string;
  subscriptionId?: string;
  readAt?: Date;
  sentEmailHistory?: Array<INotificationEmailHistoryItem>;
  resourceAttachments?: Array<INotificationResourceAttachment>;
}

const notificationResourceAttachmentSchema =
  ensureMongoSchemaFields<INotificationResourceAttachment>({
    resourceId: {type: String},
    resourceType: {type: String},
  });

export const notificationSchema = ensureMongoSchemaFields<INotification>({
  ...resourceSchema,
  recipientEmail: {type: String, index: true},
  recipientId: {type: String, index: true},
  bodyText: {type: String, default: ''},
  bodyDelta: {type: [SchemaTypes.Map], default: []},
  type: {type: String, index: true},
  title: {type: String},
  workspaceId: {type: String},
  subscriptionId: {type: String},
  readAt: {type: Date},
  sentEmailHistory: {type: [notificationEmailHistorySchema], default: []},
  resourceAttachments: {
    type: [notificationResourceAttachmentSchema],
    default: [],
  },
});

export enum NotificationSubscriptionReason {
  AddedByUser = 'addedByUser',
  UserCreatedResource = 'userCreatedResource',
  WasAssignedTask = 'wasAssignedTask',
}

export interface INotificationSubscriptionRecipient {
  userId: string;
  reason: NotificationSubscriptionReason;
  addedBy: string;
  addedAt: Date;
}

export const notificationSubscriptionRecipientSchema =
  ensureMongoSchemaFields<INotificationSubscriptionRecipient>({
    userId: {type: String, index: true},
    reason: {type: String},
    addedBy: {type: String},
    addedAt: {type: Date, default: getDate},
  });

export interface INotificationSubscription extends IResource {
  recipients: Array<INotificationSubscriptionRecipient>;
  resourceType: SystemResourceType;
  resourceId: string;
  notificationTypes: Array<NotificationType>;
  workspaceId?: string;
}

export const notificationSubscriptionSchema = ensureMongoSchemaFields<INotificationSubscription>({
  ...workspaceResourceSchema,
  recipients: {type: [notificationSubscriptionRecipientSchema], index: true},
  resourceType: {type: String, index: true},
  resourceId: {type: String, index: true},
  workspaceId: {type: String, index: true},
  notificationTypes: {type: [String]},
});

const notificationModelName = 'notification_01';
const notificationCollectionName = 'notifications_01';

export const getNotificationModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<INotification>({
      modelName: notificationModelName,
      collectionName: notificationCollectionName,
      rawSchema: notificationSchema,
      connection: conn,
    });
  }
);

export type INotificationModel = MongoModel<INotification>;

const notificationScubscriptionModelName = 'notification_subscription_01';
const notificationSubscriptionCollectionName = 'notification_subscriptions_01';

export const getNotificationSubscriptionModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<INotificationSubscription>({
      modelName: notificationScubscriptionModelName,
      collectionName: notificationSubscriptionCollectionName,
      rawSchema: notificationSubscriptionSchema,
      connection: conn,
    });
  }
);

export type INotificationSubscriptionModel = MongoModel<INotificationSubscription>;
