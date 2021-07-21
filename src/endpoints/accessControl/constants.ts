import { SystemActionType, SystemResourceType } from "../../models/system";

const permissionGroupResourceTypes = [
    SystemResourceType.Organization,
    SystemResourceType.Board,
];

const permissionResourceTypes = [
    SystemResourceType.Organization,
    SystemResourceType.Board,
    SystemResourceType.CollaborationRequest,
    SystemResourceType.PermissionGroup,
    SystemResourceType.Permission,
    SystemResourceType.Task,
    SystemResourceType.Chat,
];

const permissionActionTypes = [
    SystemActionType.Create,
    SystemActionType.Read,
    SystemActionType.Update,
    SystemActionType.Delete,
    SystemActionType.RevokeRequest,
    SystemActionType.RemoveCollaborator,
    SystemActionType.RespondToRequest,
];

export const accessControlConstants = {
    permissionGroupResourceTypes,
    permissionActionTypes,
    permissionResourceTypes,
    maxPermissionGroupNameLength: 50,
    maxPermissionGroupDescriptionLength: 200,
    maxPermissionGroups: 20,
    maxPermissions:
        permissionResourceTypes.length * permissionActionTypes.length,
};
