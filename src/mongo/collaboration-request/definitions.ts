import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";
import { BlockType } from "../block";
import {
    INotificationSentEmailHistoryItem,
    notificationSentEmailHistorySchema,
} from "../notification";

export const collaborationRequestSchemaVersion = 1; // increment when you make changes that are not backward compatible

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

export interface ICollaborationRequestRecipient {
    email: string;
}

const collaborationRequestRecipientSchema = {
    email: { type: String, index: true },
};

export enum CollaborationRequestStatusType {
    Accepted = "accepted",
    Declined = "declined",
    Revoked = "revoked",
    Pending = "pending",
}

export type CollaborationRequestResponse =
    | CollaborationRequestStatusType.Accepted
    | CollaborationRequestStatusType.Declined;

export interface ICollaborationRequestStatus {
    status: CollaborationRequestStatusType;
    date: Date;
}

const collaborationRequestStatusHistorySchema = {
    status: String,
    date: Date,
};

export enum CollaborationRequestEmailReason {
    RequestNotification = "requestNotification",
    RequestRevoked = "requestRevoked",
    RequestUpdated = "requestUpdated",
}

export interface ICollaborationRequestSentEmailHistoryItem
    extends INotificationSentEmailHistoryItem {
    reason: CollaborationRequestEmailReason;
}

export interface ICollaborationRequest {
    customId: string;
    to: ICollaborationRequestRecipient;
    title: string;
    body?: string;
    from: ICollaborationRequestFrom;
    createdAt: Date;
    expiresAt: Date;
    readAt?: Date;
    statusHistory?: ICollaborationRequestStatus[];
    sentEmailHistory?: ICollaborationRequestSentEmailHistoryItem[];
}

const collaborationRequestSchema = {
    customId: { type: String, unique: true, index: true },
    to: { type: collaborationRequestRecipientSchema },
    title: { type: String },
    body: { type: String },
    from: { type: collaborationRequestFromSchema },
    createdAt: { type: Date, default: () => getDate() },
    expiresAt: { type: Date },
    readAt: { type: Date },
    statusHistory: { type: [collaborationRequestStatusHistorySchema] },
    sentEmailHistory: { type: [notificationSentEmailHistorySchema] },
};

export default collaborationRequestSchema;

export interface ICollaborationRequestDocument
    extends ICollaborationRequest,
        Document {}
