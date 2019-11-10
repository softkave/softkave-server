import { Document } from "mongoose";

export interface INotificationFrom {
  userId: string;
  name: string;
  blockId: string;
  blockName: string;
  blockType: string;
}

const notificationFromSchema = {
  userId: String,
  name: String,
  blockId: String,
  blockName: String,
  blockType: String
};

export interface INotificationTo {
  email: string;
}

const notificationToSchema = {
  email: String
};

export interface INotificationStatus {
  status: string;
  date: number;
}

const notificationStatusHistorySchema = {
  status: String,
  date: Number
};

export interface INotificationSentEmailHistoryItem {
  date: number;
}

const notificationSentEmailHistorySchema = {
  date: Number
};

export interface INotification {
  customId: string;
  from: INotificationFrom;
  createdAt: number;
  body: string;
  readAt: number;
  to: INotificationTo;
  expiresAt: number;
  type: string;
  statusHistory: INotificationStatus[];
  sentEmailHistory: INotificationSentEmailHistoryItem[];
}

const notificationSchema = {
  customId: { type: String, unique: true },
  from: {
    type: notificationFromSchema,
    index: true
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
  body: String,
  readAt: Number,
  to: {
    type: notificationToSchema,
    index: true
  },
  expiresAt: Number,
  type: String,

  // status: pending | revoked | accepted | rejected | expired
  statusHistory: [notificationStatusHistorySchema],
  sentEmailHistory: [notificationSentEmailHistorySchema]
};

export default notificationSchema;
export interface INotificationDocument extends INotification, Document {}
