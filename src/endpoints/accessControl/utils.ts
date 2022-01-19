import {
    IPermission,
    IPermissionGroup,
    IUserAssignedPermissionGroup,
} from "../../mongo/access-control/definitions";
import { BlockType, IBlock } from "../../mongo/block";
import { getDateStringIfExists } from "../../utilities/fns";
import { InvalidRequestError } from "../errors";
import { extractFields, getFields } from "../utils";
import {
    IPublicPermission,
    IPublicPermissionGroup,
    IPublicUserAssignedPermissionGroup,
} from "./types";

const publicPermissionGroupFields = getFields<IPublicPermissionGroup>({
    customId: true,
    name: true,
    description: true,
    createdBy: true,
    createdAt: getDateStringIfExists,
    updatedBy: true,
    updatedAt: getDateStringIfExists,
    resourceId: true,
    resourceType: true,
    lowerCasedName: true,
    nextId: true,
    prevId: true,
});

const publicPermissionFields = getFields<IPublicPermission>({
    customId: true,
    action: true,
    permissionGroups: true,
    users: true,
    permissionOwnerId: true,
    resourceType: true,
    createdBy: true,
    createdAt: getDateStringIfExists,
    updatedBy: true,
    updatedAt: getDateStringIfExists,
    available: true,
    orgId: true,
});

const publicUserPermissionGroupMapFields =
    getFields<IPublicUserAssignedPermissionGroup>({
        userId: true,
        organizationId: true,
        resourceId: true,
        resourceType: true,
        permissionGroupId: true,
        addedAt: getDateStringIfExists,
        addedBy: true,
        customId: true,
    });

export const getPublicPermissionGroups = (
    permissionGroup: IPermissionGroup
): IPublicPermissionGroup => {
    return extractFields(permissionGroup, publicPermissionGroupFields);
};

export function getPublicPermissionData(
    permission: IPermission
): IPublicPermission {
    return extractFields(permission, publicPermissionFields);
}

export function getPublicPermissionsArray(
    permissions: IPermission[]
): IPublicPermission[] {
    return permissions.map((user) =>
        extractFields(user, publicPermissionFields)
    );
}

export function getPublicPermissionGroupsArray(
    permissionGroups: IPermissionGroup[]
): IPublicPermissionGroup[] {
    return permissionGroups.map((user) =>
        extractFields(user, publicPermissionGroupFields)
    );
}

export function assertIsPermissionBlock(block: IBlock) {
    if (
        (block.type !== BlockType.Organization &&
            block.type !== BlockType.Board) ||
        block.permissionResourceId !== block.customId
    ) {
        throw new InvalidRequestError();
    }
}

export function getPublicUserAssignedPermissionGroupArray(
    data: IUserAssignedPermissionGroup[]
): IPublicUserAssignedPermissionGroup[] {
    return data.map((item) =>
        extractFields(item, publicUserPermissionGroupMapFields)
    );
}

export function getPublicUserAssignedPermissionGroup(
    data: IUserAssignedPermissionGroup
): IPublicUserAssignedPermissionGroup {
    return extractFields(data, publicUserPermissionGroupMapFields);
}
