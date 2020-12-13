import { getPublicUserAssignedPermissionGroupArray } from "../utils";
import { GetUserPermissionsEndpoint } from "./types";

const getUserPermissions: GetUserPermissionsEndpoint = async (
    context,
    instData
) => {
    const user = await context.session.getUser(context, instData);
    const userAssignedPermissionGroups = await context.accessControl.getUserAssignedPermissionGroups(
        context,
        user.customId
    );

    return {
        permissionGroups: getPublicUserAssignedPermissionGroupArray(
            userAssignedPermissionGroups
        ),
    };
};

export default getUserPermissions;
