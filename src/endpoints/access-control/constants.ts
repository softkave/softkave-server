import { SystemActionType, SystemResourceType } from "../../models/system";

const roleResourceTypes = [SystemResourceType.Org, SystemResourceType.Board];

const permissionResourceTypes = [
    SystemResourceType.Org,
    SystemResourceType.Board,
    SystemResourceType.CollaborationRequest,
    SystemResourceType.Role,
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
    roleResourceTypes,
    permissionActionTypes,
    permissionResourceTypes,
    maxRoleNameLength: 50,
    maxRoleDescriptionLength: 200,
    maxRoles: 20,
    maxPermissions:
        permissionResourceTypes.length * permissionActionTypes.length,
};
