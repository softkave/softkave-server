import { IPermission } from "../../mongo/access-control/definitions";
import { IUser } from "../../mongo/user";

function mapUsersToPermissions(
    organizationId: string,
    users: IUser[],
    permissions: IPermission[]
) {
    const usersToPermissionsMap: Record<
        string,
        Record<string, IPermission>
    > = {};
    const permissionGroupsToPermissionsMap: Record<
        string,
        Record<string, IPermission>
    > = {};

    permissions.forEach((p) => {
        p.permissionGroups.forEach((permissionGroupId) => {
            const permissionGroupPermissions =
                permissionGroupsToPermissionsMap[permissionGroupId] || {};
            permissionGroupPermissions[permissionGroupId] = p;
            permissionGroupsToPermissionsMap[permissionGroupId] =
                permissionGroupPermissions;
        });

        p.users.forEach((userId) => {
            const userPermissions = usersToPermissionsMap[userId] || {};
            userPermissions[p.customId] = p;
            usersToPermissionsMap[userId] = userPermissions;
        });
    });

    // users.forEach((user) => {
    //     let userPermissions = usersToPermissionsMap[user.customId] || {};
    //     const organizationData = user.organizations.find((organization) => organization.customId === organizationId);
    //     const permissionGroups = organizationData.permissionGroups || [];

    //     permissionGroups.forEach((permissionGroupId) => {
    //         const permissionGroupPermissions = permissionGroupsToPermissionsMap[permissionGroupId] || {};
    //         userPermissions = {
    //             ...userPermissions,
    //             ...permissionGroupPermissions,
    //         };
    //     });

    //     usersToPermissionsMap[user.customId] = userPermissions;
    // });

    return usersToPermissionsMap;
}

function diffPermissions(
    p1Map: Record<string, IPermission>,
    p2Map: Record<string, IPermission>
) {
    const added: IPermission[] = [];
    const removed: IPermission[] = [];

    Object.values(p1Map).forEach((p) => {
        if (!p2Map[p.customId]) {
            removed.push(p);
        }
    });

    Object.values(p2Map).forEach((p) => {
        if (!p1Map[p.customId]) {
            added.push(p);
        }
    });

    return { added, removed };
}

function getPermissionChanges(
    organizationId: string,
    users: IUser[],
    oldPermissions: IPermission[],
    newPermissions: IPermission[]
) {
    const oldMap = mapUsersToPermissions(organizationId, users, oldPermissions);
    const newMap = mapUsersToPermissions(organizationId, users, newPermissions);
    const permissionChanges: Record<
        string,
        {
            added: IPermission[];
            removed: IPermission[];
        }
    > = {};

    // tslint:disable-next-line: forin
    for (const userId in oldMap) {
        const changes = diffPermissions(oldMap[userId], newMap[userId]);
        permissionChanges[userId] = changes;
    }

    return permissionChanges;
}

function diffUserPermissionGroups() {}
