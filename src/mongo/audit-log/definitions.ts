import { Document, Schema } from "mongoose";

export const auditLogSchemaVersion = 1; // increment when you make changes that are not backward compatible

export enum System {
    System = "system",
}

export interface IAuditLogChange {
    customId: string;
    newValue: any;
    oldValue: any;
}

const auditLogChangeSchema = {
    customId: { type: String },
    newValue: { type: Schema.Types.Mixed },
    oldValue: { type: Schema.Types.Mixed },
};

export enum AuditLogResourceType {
    User = "user",
    RootBlock = "root",
    Org = "org",
    Group = "group",
    Board = "board",
    Task = "task",
    Status = "status",
    Label = "label",
    Resolution = "resolution",
    CollaborationRequest = "collab-req",
    CollaboratorRemoved = "remove-collaborator",
    Note = "note",
    Comment = "comment",
}

export enum AuditLogActionType {
    Create = "create",
    Update = "update",
    Delete = "delete",
    Revoke = "revoke",
    Remove = "remove",
    Decline = "decline",
    Signup = "signup",
    Login = "login",
    ForgotPassword = "forgot-password",
    ChangePassword = "change-password",
    ChangePasswordWithToken = "change-password-with-token",
    Transfer = "transfer",
}

// export enum AuditLogSystemJustification {
//   ParentDeleted = "parent-deleted",
//   ParentRestored = "parent-restored",
// }

// export interface IAuditLogCollateralChangeMeta {
//   initialResourceId: string;
// }

export interface IAuditLog {
    customId: string;
    action: AuditLogActionType;
    resourceId: string;
    resourceType: AuditLogResourceType;
    createdAt: Date;
    ips: string[]; // should we respect do not track?
    userAgent: string;
    userId?: string;
    organizationId?: string;
    change?: IAuditLogChange;
    resourceOwnerId?: string; // for status and labels, and other "inside" resources

    // TODO: add to context
    date: Date;

    // isSystemActioned?: boolean;
    // systemJustification?: AuditLogSystemJustification;

    // meta: any[];
    // tags: string[];

    // justification: string; // why were they allowed to perform this action?
    // reason: string;
    // chainId: string; // or threadId, if the action is part of a series of actions

    // serverId: string;
    // instanceId: string;

    // clientId: string;
    // userToken: string;

    // requestId: string;
    // responseTime: number;
    // requestStart: string;
    // requestEnd: string;
    // fn: string;
    // start: string;
    // end: string;
    // duration: number;
    // caller: string;
    // error: string;
    // feature: string;
    // componentId: string;
    // eventType: string;

    // env: string;
    // level: string;
    // message: string;

    // type: string;
    // file: string;
    // line: string;
}

export interface IAuditLogDocument extends IAuditLog, Document {}

const auditLogSchema = {
    customId: { type: String, unique: true, index: true },
    action: { type: String },
    date: { type: Date },
    resourceId: { type: String },
    resourceType: { type: String },
    userId: { type: String },
    organizationId: { type: String },
    createdAt: { type: Date },
    ips: { type: [String] },
    userAgent: { type: String },
    resourceOwnerId: { type: String },
    change: { type: auditLogChangeSchema },
};

export default auditLogSchema;
