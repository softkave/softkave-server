import { Document } from "mongoose";
import { SystemResourceType } from "../../models/system";

export interface INotificationEmailHistoryItem {
  date: Date;
}

export const notificationEmailHistorySchema = {
  date: { type: Date },
};

export enum NotificationType {
  // Collaboration request
  NewCollaborationRequest = "newCollaborationRequest",
  CollaborationRequestResponse = "collaborationRequestResponse",
  CollaborationRequestUpdated = "collaborationRequestUpdated",
  CollaborationRequestRevoked = "collaborationRequestRevoked",

  // Task
  TaskAssigned = "taskAssigned",
  TaskUnassigned = "taskUnassigned",
  TaskCompleted = "taskCompleted",
  TaskUpdated = "taskUpdated",

  // Chat
  UnseenChat = "unseenChat",
}

enum NotificationActions {
  GotoResource = "gotoResource",
  RespondToCollaboratonRequest = "respondToCollaborationRequest",
}

export interface INotificationAttachment {
  resourceType: SystemResourceType;
  resourceId: string;
  textLocationStart?: number;
  textLocationEnd?: number;
  text?: string;
}

export const notificationAttachmentSchema = {
  resourceType: { type: String },
  resourceId: { type: String },
  textLocationStart: { type: Number },
  textLocationEnd: { type: Number },
  text: { type: String },
};

export interface INotification {
  customId: string;
  recipientEmail: string;
  recipientId?: string;
  body: string;
  type: NotificationType;
  title: string;
  orgId?: string;
  subscriptionResourceId?: string;
  subscriptionResourceType?: SystemResourceType;
  subscriptionId?: string;
  primaryResourceType?: SystemResourceType;
  primaryResourceId?: string;
  createdAt: Date;
  readAt?: Date;
  sentEmailHistory?: INotificationEmailHistoryItem[];
  attachments?: INotificationAttachment[];
  actions?: NotificationActions[];
  meta?: any[];
  reason?: NotificationReason;
}

export const notificationSchema = {
  customId: { type: String, unique: true, index: true },
  recipientId: { type: String },
  body: { type: String },
  orgId: { type: String },
  blockId: { type: String },
  createdAt: { type: Date },
  type: { type: String },
  readAt: { type: Date },
  sentEmailHistory: { type: [notificationEmailHistorySchema] },
  annotations: { type: [notificationAttachmentSchema] },
  subscriptionResourceId: { type: String },
  subscriptionResourceType: { type: String },
  subscriptionId: { type: String },
  primaryResourceType: { type: String },
  primaryResourceId: { type: String },
  actions: { type: [String] },
};

export interface INotificationDocument extends INotification, Document {}

export interface INotificationSubscriptionRecipient {
  userId: string;
  reason: NotificationReason;
  addedBy: string;
  addedAt: Date;
}

export enum NotificationReason {
  AddedByUser = "",
  UserCreatedResource = "",
  WasAssignedTask = "",
  WasAutoAssignedTask = "",
  UserIsResourceRecipient = "",
}

export interface INotificationSubscription {
  customId: string;
  recipients: INotificationSubscriptionRecipient[];
  resourceType: SystemResourceType;
  resourceId: string;
  type: NotificationType;
  orgId: string;
}

export const notificationSubscriptionSchema = {
  customId: { type: String, unique: true, index: true },
  recipientIds: { type: [String] },
  resourceType: { type: String },
  resourceId: { type: String },
  type: { type: String },
  orgId: { type: String },
};

export interface INotificationSubscriptionDocument
  extends INotificationSubscription,
    Document {}
