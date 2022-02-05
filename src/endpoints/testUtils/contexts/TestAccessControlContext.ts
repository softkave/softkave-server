import makeSingletonFn from "../../../utilities/createSingletonFunc";
import { IAccessControlContext } from "../../contexts/AccessControlContext";
import { testNoop } from "../utils";

class TestAccessControlContext implements IAccessControlContext {
    getPermissionGroupsById = testNoop;
    getPermissionGroupsByResourceId = testNoop;
    getPermissionGroupsByNames = testNoop;
    savePermissionGroups = testNoop;
    updatePermissionGroup = testNoop;
    deletePermissionGroups = testNoop;
    permissionGroupExists = testNoop;
    bulkUpdatePermissionGroupsById = testNoop;

    // Permissions
    getResourcePermissions = testNoop;
    queryPermission = testNoop;
    queryPermissions = testNoop;
    assertPermission = testNoop;
    assertPermissions = testNoop;
    savePermissions = testNoop;
    updatePermission = testNoop;
    deletePermissions = testNoop;
    getPermissionsByResourceId = testNoop;
    bulkUpdatePermissionsById = testNoop;

    // User-assigned permission groups
    saveUserAssignedPermissionGroup = testNoop;
    deleteUserAssignedPermissionGroupsByPermissionGroupId = testNoop;
    deleteUserAssignedPermissionGroupsByUserAndPermissionGroupIds = testNoop;
    getUserAssignedPermissionGroups = testNoop;
}

export const getTestAccessControlContext = makeSingletonFn(
    () => new TestAccessControlContext()
);
