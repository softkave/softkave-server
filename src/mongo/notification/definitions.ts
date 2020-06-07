import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";
import { BlockType } from "../block";

export const notificationSchemaVersion = 1; // increment when you make changes that are not backward compatible

export interface ICollaborationRequestFrom {
  userId: string;
  name: string;
  blockId: string;
  blockName: string;
  blockType: BlockType;
}

const collaborationRequestFromSchema = {
  userId: { type: String, index: true },
  name: String,
  blockId: { type: String, index: true },
  blockName: String,
  blockType: String,
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
