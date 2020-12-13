import { Document } from "mongoose";
import { SystemActionType, SystemResourceType } from "../../models/system";
import {
    getPermissionsListFromResourceTypeToActionsMap,
    getResourceTypeToActionsMapByResourceTypeList,
} from "./utils";

export enum DefaultPermissionGroupNames {
    Public = "public",
    Collaborator = "collaborator",
    Admin = "admin",
}

export interface IPermissionGroup {
    customId: string;
    name: string;
    lowerCasedName: string;
    description?: string;
    createdBy: string;
    createdAt: string;
    updatedBy?: string;
    updatedAt?: string;
    resourceId: string;
    resourceType: SystemResourceType;
    prevId?: string;
    nextId?: string;
}

export const permissionGroupMongoSchema = {
    customId: { type: String, unique: true },
    name: { type: String },
    lowerCasedName: { type: String },
    description: { type: String },
    createdBy: { type: String },
    createdAt: { type: Date },
    updatedBy: { type: String },
    updatedAt: { type: Date },
    resourceId: { type: String },
    resourceType: { type: String },
    prevId: { type: String },
    nextId: { type: String },
};

export interface IPermissionGroupDocument extends IPermissionGroup, Document {}

export interface IPermission {
    customId: string;
    resourceType: SystemResourceType;
    action: SystemActionType;
    permissionGroups: string[];
    users: string[];
    orgId: string;
    permissionOwnerId: string;
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
    available: boolean;
}

export const permissionMongoSchema = {
    customId: { type: String, unique: true },
    action: { type: String },
    permissionGroups: { type: [String] },
    users: { type: [String] },
    permissionOwnerId: { type: String },
    resourceType: { type: String },
    createdBy: { type: String },
    createdAt: { type: Date },
    updatedBy: { type: String },
    updatedAt: { type: Date },
    available: { type: Boolean },
    orgId: { type: String },
};

export interface IPermissionDocument extends IPermission, Document {}

export const orgResourceTypes: SystemResourceType[] = [
    SystemResourceType.Collaborator,
    SystemResourceType.Org,
    SystemResourceType.Board,
    SystemResourceType.Task,
    SystemResourceType.Status,
    SystemResourceType.Label,
    SystemResourceType.Resolution,
    SystemResourceType.Note,
    SystemResourceType.Comment,
    SystemResourceType.Room,
    SystemResourceType.Sprint,
    SystemResourceType.Chat,
    SystemResourceType.SubTask,
    SystemResourceType.CollaborationRequest,
    SystemResourceType.Notification,
    SystemResourceType.NotificationSubscription,
    SystemResourceType.Team,
    SystemResourceType.PermissionGroup,
    SystemResourceType.Permission,
];

export const boardResourceTypes: SystemResourceType[] = [
    SystemResourceType.Board,
    SystemResourceType.Task,
    SystemResourceType.Status,
    SystemResourceType.Label,
    SystemResourceType.Resolution,
    SystemResourceType.Note,
    SystemResourceType.Comment,
    SystemResourceType.Sprint,
    SystemResourceType.SubTask,
    SystemResourceType.Notification,
    SystemResourceType.NotificationSubscription,
    SystemResourceType.Team,
    SystemResourceType.PermissionGroup,
    SystemResourceType.Permission,
];

export const baseActionTypes: SystemActionType[] = [
    SystemActionType.Create,
    SystemActionType.Read,
    SystemActionType.Update,
    SystemActionType.Delete,
];

export type IResourceTypeToActionsMap = Record<
    SystemResourceType,
    SystemActionType[]
>;

export const resourceTypesToActionsMap: IResourceTypeToActionsMap = {
    [SystemResourceType.User]: [
        SystemActionType.Signup,
        SystemActionType.Login,
        SystemActionType.ForgotPassword,
        SystemActionType.ChangePassword,
        SystemActionType.ChangePasswordWithToken,
    ],
    [SystemResourceType.Collaborator]: [SystemActionType.RemoveCollaborator],
    [SystemResourceType.RootBlock]: [],
    [SystemResourceType.Org]: [
        SystemActionType.Read,
        SystemActionType.Update,
        SystemActionType.Delete,
    ],
    [SystemResourceType.Board]: baseActionTypes,
    [SystemResourceType.Task]: baseActionTypes,
    [SystemResourceType.Status]: baseActionTypes,
    [SystemResourceType.Label]: baseActionTypes,
    [SystemResourceType.Resolution]: baseActionTypes,
    [SystemResourceType.Note]: baseActionTypes,
    [SystemResourceType.Comment]: baseActionTypes,
    [SystemResourceType.Room]: baseActionTypes,
    [SystemResourceType.Sprint]: [
        SystemActionType.Create,
        SystemActionType.Update,
        SystemActionType.Delete,
    ],
    [SystemResourceType.Chat]: baseActionTypes,
    [SystemResourceType.SubTask]: baseActionTypes,
    [SystemResourceType.CollaborationRequest]: [
        SystemActionType.Create,
        SystemActionType.Read,
        SystemActionType.Update,
        SystemActionType.RevokeRequest,
    ],
    [SystemResourceType.Notification]: [SystemActionType.Read],
    [SystemResourceType.NotificationSubscription]: [
        SystemActionType.Read,
        SystemActionType.Update,
    ],
    [SystemResourceType.Team]: baseActionTypes,
    [SystemResourceType.PermissionGroup]: [],
    [SystemResourceType.Permission]: [
        SystemActionType.Read,
        SystemActionType.Update,
    ],
};

export const orgResourceTypesToActionsMap = getResourceTypeToActionsMapByResourceTypeList(
    orgResourceTypes
);

export const boardResourceTypesToActionsMap = getResourceTypeToActionsMapByResourceTypeList(
    boardResourceTypes
);

export const orgResourceTypesToActionList = getPermissionsListFromResourceTypeToActionsMap(
    orgResourceTypesToActionsMap
);

export const boardResourceTypesToActionList = getPermissionsListFromResourceTypeToActionsMap(
    boardResourceTypesToActionsMap
);

export interface IPermissionLikeObject {
    resourceType: SystemResourceType;
    action: SystemActionType;
}

export type IFreezedPermission = IPermissionLikeObject;

export const freezedPermissionMongoSchema = {
    action: { type: String },
    resourceType: { type: String },
};

export interface IFreezedPermissionDocument
    extends IFreezedPermission,
        Document {}

export interface IUserAssignedPermissionGroup {
    userId: string;
    orgId: string;
    resourceId: string;
    resourceType: SystemResourceType;
    permissionGroupId: string;
    addedAt: string;
    addedBy: string;
}

export const userAssignedPermissionGroupMongoSchema = {
    userId: { type: String },
    orgId: { type: String },
    resourceId: { type: String },
    resourceType: { type: String },
    permissionGroupId: { type: String },
    addedAt: { type: String },
    addedBy: { type: String },
};

export interface IUserAssignedPermissionGroupDocument
    extends IUserAssignedPermissionGroup,
        Document {}
