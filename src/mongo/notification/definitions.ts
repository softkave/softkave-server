import { Document } from "mongoose";
import { SystemResourceType } from "../../models/system";

export const notificationSchemaVersion = 1; // increment when you make changes that are not backward compatible

export interface INotificationSentEmailHistoryItem {
    date: Date;
}

export const notificationSentEmailHistorySchema = {
    date: { type: Date },
};

export enum NotificationType {
    NewCollaborationRequest = "newCollaborationRequest",
    CollaborationRequestResponse = "collaborationRequestResponse",

    OrgUpdated = "orgUpdated",
    OrgDeleted = "orgDeleted",

    CollaboratorRemoved = "collaboratorRemoved",
    CollaboratorPermissionsUpdated = "collaboratorPermissionsUpdated",
    CollaboratorRolesUpdated = "collaboratorRolesUpdated",

    PermissionsUpdated = "permissionsUpdated",

    // RoleCreated = "roleCreated",
    // RoleUpdated = "roleUpdated",
    // RoleDeleted = "roleDeleted",
    ResourceRolesUpdated = "resourceRolesUpdated",

    CollaborationRequestCreated = "collaborationRequestCreated",
    CollaborationRequestUpdated = "collaborationRequestUpdated",
    CollaborationRequestRevoked = "collaborationRequestRevoked",

    BoardCreated = "boardCreated",
    BoardUpdated = "boardUpdated",
    BoardDeleted = "boardDeleted",

    TaskCreated = "taskCreated",
    TaskUpdated = "taskUpdated",
    TaskDeleted = "taskDeleted",
    TaskAssigned = "taskAssigned",
    TaskUnassigned = "taskUnassigned",

    // StatusCreated = "statusCreated",
    // StatusUpdated = "statusUpdated",
    // StatusDeleted = "statusDeleted",
    BoardStatusesUpdated = "boardStatusesUpdated",

    // LabelCreated = "labelCreated",
    // LabelUpdated = "labelUpdated",
    // LabelDeleted = "labelDeleted",
    BoardLabelsUpdated = "boardLabelsUpdated",

    // ResolutionCreated = "resolutionCreated",
    // ResolutionUpdated = "resolutionUpdated",
    // ResolutionDeleted = "resolutionDeleted",
    BoardResolutionsUpdated = "boardResolutionsUpdated",

    SprintCreated = "sprintCreated",
    SprintUpdated = "sprintUpdated",
    SprintDeleted = "sprintDeleted",

    ChatCreated = "chatCreated",
    ChatUpdated = "chatUpdated",
    ChatDeleted = "chatDeleted",

    NewRelease = "newRelease",
    NewPermissions = "newPermissions",
}

enum NotificationActions {
    Reload = "reload",
    SetNewPermissions = "setNewPermissions",
    RespondToCollaboratonRequest = "respondToCollaborationRequest",
}

export interface INotificationAttachment {
    resourceType: SystemResourceType;
    resourceId: string;
    places?: Array<{ start: number; end: number }>;
    text?: string[];
}

export const notificationAttachedResourceSchema = {
    resourceType: { type: String },
    resourceId: { type: String },
    annotationText: { type: String },
};

export enum NotificationReason {
    AddedByUser = "",
    UserCreatedResource = "",
    WasAssignedTask = "",
    WasAutoAssignedTask = "",
    UserIsResourceRecipient = "",
}

export interface INotification {
    customId: string;
    recipientId: string;
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
    sentEmailHistory?: INotificationSentEmailHistoryItem[];
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
    sentEmailHistory: { type: [notificationSentEmailHistorySchema] },
    annotations: { type: [notificationAttachedResourceSchema] },
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
