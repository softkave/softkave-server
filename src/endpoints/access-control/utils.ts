import {
    IAccessControlPermission,
    IAccessControlRole,
} from "../../mongo/access-control/definitions";
import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { IPublicPermissionData, IPublicRoleData } from "./types";

const publicRoleFields = getFields<IPublicRoleData>({
    customId: true,
    name: true,
    description: true,
    createdBy: true,
    createdAt: getDateString,
    updatedBy: true,
    updatedAt: getDateString,
    resourceId: true,
    resourceType: true,
    lowerCasedName: true,
});

const publicPermissionFields = getFields<IPublicPermissionData>({
    customId: true,
    action: true,
    roles: true,
    users: true,
    permissionOwnerId: true,
    resourceType: true,
    createdBy: true,
    createdAt: getDateString,
    updatedBy: true,
    updatedAt: getDateString,
});

export const getPublicRoleData = (
    role: IAccessControlRole
): IPublicRoleData => {
    return extractFields(role, publicRoleFields);
};

export function getPublicPermissionData(
    permission: IAccessControlPermission
): IPublicPermissionData {
    return extractFields(permission, publicPermissionFields);
}

export function getPublicPermissionsArray(
    permissions: IAccessControlPermission[]
): IPublicPermissionData[] {
    return permissions.map((user) =>
        extractFields(user, publicPermissionFields)
    );
}

export function getPublicRolesArray(
    roles: IAccessControlRole[]
): IPublicRoleData[] {
    return roles.map((user) => extractFields(user, publicRoleFields));
}
