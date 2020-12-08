import { Document } from "mongoose";
import { SystemActionType, SystemResourceType } from "../../models/system";
import {
    getPermissionsListFromResourceTypeToActionsMap,
    getResourceTypeToActionsMapByResourceTypeList,
} from "./utils";

// TODO: we should implement a justification system

export enum AccessControlDefaultRoles {
    Public = "public",
    Collaborator = "collaborator",
    Admin = "admin",
}

export enum AccessControlRoleSystemType {
    Hierarchical = "hierarchical",
    Flat = "flat",
}

export interface IAccessControlRole {
    customId: string;
    name: string;
    lowerCasedName: string;
    description?: string;
    // permissions: IAccessControlPermission[];
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
    // updateJustification?: IAccessControlActionJustification;
    resourceId: string;
    resourceType: SystemResourceType;
    prevRoleId?: string;
    nextRoleId?: string;
}

export const accessControlRoleMongoSchema = {
    customId: { type: String, unique: true },
    name: { type: String },
    lowerCasedName: { type: String },
    description: { type: String },
    // permissions: { type: [accessControlPermisionMongoSchema] },
    createdBy: { type: String },
    createdAt: { type: Date },
    updatedBy: { type: String },
    updatedAt: { type: Date },
    // updateJustification: { type: [accessControlActionJustificationSchema] },
    resourceId: { type: String },
    resourceType: { type: String },
    prevRoleId: { type: String },
    nextRoleId: { type: String },
};

export interface IAccessControlRoleDocument
    extends IAccessControlRole,
        Document {}

export interface IAccessControlPermission {
    customId: string;
    resourceType: SystemResourceType;
    action: SystemActionType;
    roles: string[];
    users: string[];
    orgId: string;
    permissionOwnerId: string;
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
    available: boolean;
}

export const accessControlPermissionMongoSchema = {
    customId: { type: String, unique: true },
    action: { type: String },
    roles: { type: [String] },
    users: { type: [String] },
    resourceId: { type: String },
    resourceType: { type: String },
    createdBy: { type: String },
    createdAt: { type: Date },
    updatedBy: { type: String },
    updatedAt: { type: Date },
    available: { type: Boolean },
};

export interface IAccessControlPermissionDocument
    extends IAccessControlPermission,
        Document {}

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
    SystemResourceType.Role,
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
    SystemResourceType.Role,
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
    [SystemResourceType.Role]: baseActionTypes,
    [SystemResourceType.Permission]: [
        SystemActionType.Read,
        SystemActionType.Update,
    ],
};

export const orgResourceTypeToActionsMap = getResourceTypeToActionsMapByResourceTypeList(
    orgResourceTypes
);

export const boardResourceTypeToActionsMap = getResourceTypeToActionsMapByResourceTypeList(
    boardResourceTypes
);

export const orgResourceTypeToActionList = getPermissionsListFromResourceTypeToActionsMap(
    orgResourceTypeToActionsMap
);

export const boardResourceTypeToActionList = getPermissionsListFromResourceTypeToActionsMap(
    boardResourceTypeToActionsMap
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
