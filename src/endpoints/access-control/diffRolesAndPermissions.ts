import { IAccessControlPermission } from "../../mongo/access-control/definitions";
import { IUser } from "../../mongo/user";
import { indexArray } from "../../utilities/fns";

function mapUsersToPermissions(
    orgId: string,
    users: IUser[],
    permissions: IAccessControlPermission[]
) {
    const usersToPermissionsMap: Record<
        string,
        Record<string, IAccessControlPermission>
    > = {};
    const rolesToPermissionsMap: Record<
        string,
        Record<string, IAccessControlPermission>
    > = {};

    permissions.forEach((p) => {
        p.roles.forEach((roleId) => {
            const rolePermissions = rolesToPermissionsMap[roleId] || {};
            rolePermissions[roleId] = p;
            rolesToPermissionsMap[roleId] = rolePermissions;
        });

        p.users.forEach((userId) => {
            const userPermissions = usersToPermissionsMap[userId] || {};
            userPermissions[p.customId] = p;
            usersToPermissionsMap[userId] = userPermissions;
        });
    });

    users.forEach((user) => {
        let userPermissions = usersToPermissionsMap[user.customId] || {};
        const orgData = user.orgs.find((org) => org.customId === orgId);
        const roles = orgData.roles || [];

        roles.forEach((roleId) => {
            const rolePermissions = rolesToPermissionsMap[roleId] || {};
            userPermissions = {
                ...userPermissions,
                ...rolePermissions,
            };
        });

        usersToPermissionsMap[user.customId] = userPermissions;
    });

    return usersToPermissionsMap;
}

function diffPermissions(
    p1Map: Record<string, IAccessControlPermission>,
    p2Map: Record<string, IAccessControlPermission>
) {
    const added: IAccessControlPermission[] = [];
    const removed: IAccessControlPermission[] = [];

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
    orgId: string,
    users: IUser[],
    oldPermissions: IAccessControlPermission[],
    newPermissions: IAccessControlPermission[]
) {
    const oldMap = mapUsersToPermissions(orgId, users, oldPermissions);
    const newMap = mapUsersToPermissions(orgId, users, newPermissions);
    const permissionChanges: Record<
        string,
        {
            added: IAccessControlPermission[];
            removed: IAccessControlPermission[];
        }
    > = {};

    // tslint:disable-next-line: forin
    for (const userId in oldMap) {
        const changes = diffPermissions(oldMap[userId], newMap[userId]);
        permissionChanges[userId] = changes;
    }

    return permissionChanges;
}

function diffUserRoles() {}
