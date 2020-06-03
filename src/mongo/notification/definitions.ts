import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";
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
  userId: { type: String, index: true },
  name: String,
  blockId: { type: String, index: true },
  blockName: String,
};

export interface INotificationTo {
  email: string;
}

const notificationToSchema = {
  email: { type: String, index: true },
};

export enum CollaborationRequestStatusType {
  Accepted = "accepted",
  Declined = "declined",
  Revoked = "revoked",
  Pending = "pending",
}

export interface ICollaborationRequestStatus {
  status: CollaborationRequestStatusType;
  date: Date;
}

const collaborationRequestStatusHistorySchema = {
  status: String,
  date: Date,
};

export interface INotificationSentEmailHistoryItem {
  date: Date;
}

const notificationSentEmailHistorySchema = {
  date: Date,
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
  createdAt: Date;
  type: NotificationType;
  readAt?: Date;
  expiresAt?: Date;
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
  customId: { type: String, unique: true, index: true },
  to: { type: notificationToSchema },
  body: { type: String },
  from: { type: collaborationRequestFromSchema },
  createdAt: { type: Date, default: () => getDate() },
  type: { type: String },
  readAt: { type: Date },
  expiresAt: { type: Date },
  statusHistory: { type: [collaborationRequestStatusHistorySchema] },
  sentEmailHistory: { type: [notificationSentEmailHistorySchema] },
};

export default notificationSchema;
export interface INotificationDocument extends INotification, Document {}
