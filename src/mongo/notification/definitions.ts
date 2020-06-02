import { Document } from "mongoose";
import { BlockType } from "../block";

export const notificationSchemaVersion = 1; // increment when you make changes that are not backward compatible

export interface INotificationFrom0 {
  userId: string;
  name: string;
  blockId: string;
  blockName: string;
  blockType: string;
}

export interface ICollaborationRequestFrom {
  userId: string;
  name: string;
  blockId: string;
  blockName: string;
  blockType: BlockType;
}

const notificationFromSchema = {
  userId: String,
  name: String,
  blockId: String,
  blockName: String,
  blockType: String,
};

const collaborationRequestFromSchema = {
  userId: String,
  name: String,
  blockId: String,
  blockName: String,
};

export interface INotificationTo {
  email: string;
}

const notificationToSchema = {
  email: String,
};

export enum CollaborationRequestStatusType {
  Accepted = "accepted",
  Declined = "declined",
  Revoked = "revoked",
  Pending = "pending",
}

export interface ICollaborationRequestStatus {
  status: CollaborationRequestStatusType;
  date: string;
}

const collaborationRequestStatusHistorySchema = {
  status: String,
  date: String,
};

export interface INotificationSentEmailHistoryItem {
  date: string;
}

const notificationSentEmailHistorySchema = {
  date: String,
};

export enum NotificationType {
  CollaborationRequest = "collab-req",
  RemoveCollaborator = "remove-collaborator",
  OrgDeleted = "org-deleted",
}

export interface INotification0 {
  customId: string;
  from: ICollaborationRequestFrom;
  createdAt: number;
  body: string;
  to: INotificationTo;
  type: NotificationType;
  readAt?: number;
  expiresAt?: number;
  statusHistory?: ICollaborationRequestStatus[];
  sentEmailHistory?: INotificationSentEmailHistoryItem[];
}

export interface INotification {
  customId: string;
  to: INotificationTo;
  body: string;
  from?: ICollaborationRequestFrom;
  createdAt: string;
  type: NotificationType;
  readAt?: string;
  expiresAt?: string;
  statusHistory?: ICollaborationRequestStatus[];
  sentEmailHistory?: INotificationSentEmailHistoryItem[];
}

export const notificationSchema0 = {
  customId: { type: String, unique: true },
  from: {
    type: notificationFromSchema,
    index: true,
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
  body: String,
  readAt: Number,
  to: {
    type: notificationToSchema,
    index: true,
  },
  expiresAt: Number,
  type: String,
  statusHistory: [collaborationRequestStatusHistorySchema],
  sentEmailHistory: [notificationSentEmailHistorySchema],
};

const notificationSchema = {
  customId: { type: String },
  to: { type: notificationToSchema },
  body: { type: String },
  collaborationRequestFrom: { type: collaborationRequestFromSchema },
  createdAt: { type: String },
  type: { type: String },
  readAt: { type: String },
  expiresAt: { type: String },
  statusHistory: { type: collaborationRequestStatusHistorySchema },
  sentEmailHistory: { type: notificationSentEmailHistorySchema },
};

export default notificationSchema;
export interface INotificationDocument extends INotification, Document {}
