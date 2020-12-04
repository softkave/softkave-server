import {
    AccessControlDefaultRoles,
    IAccessControlRole,
} from "../../mongo/access-control/definitions";
import { getBlockAuditLogResourceType } from "../../mongo/audit-log/utils";
import { BlockType, IBlock } from "../../mongo/block";
import { IUser } from "../../mongo/user";
import { getDate } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { IBaseContext } from "../contexts/BaseContext";

const publicRoleName = AccessControlDefaultRoles.Public.toLowerCase();
const publicRoleDescription = "";

const collaboratorRoleName = AccessControlDefaultRoles.Collaborator.toLowerCase();
const collaboratorRoleDescription = "";

const adminRoleName = AccessControlDefaultRoles.Admin.toLowerCase();
const adminRoleDescription = "";

export function getDefaultOrgRoles(userId: string, org: IBlock) {
    const newRoles: IAccessControlRole[] = [];
    const publicRole: IAccessControlRole = {
        customId: getNewId(),
        name: publicRoleName,
        lowerCasedName: publicRoleName,
        description: publicRoleDescription,
        createdBy: userId,
        createdAt: getDate(),
        resourceId: org.customId,
        resourceType: getBlockAuditLogResourceType(org),
    };

    const collaboratorRole: IAccessControlRole = {
        customId: getNewId(),
        name: collaboratorRoleName,
        lowerCasedName: collaboratorRoleName,
        description: collaboratorRoleDescription,
        createdBy: userId,
        createdAt: getDate(),
        resourceId: org.customId,
        resourceType: getBlockAuditLogResourceType(org),
        prevRoleId: publicRole.customId,
    };

    const adminRole: IAccessControlRole = {
        customId: getNewId(),
        name: adminRoleName,
        lowerCasedName: adminRoleName,
        description: adminRoleDescription,
        createdBy: userId,
        createdAt: getDate(),
        resourceId: org.customId,
        resourceType: getBlockAuditLogResourceType(org),
        prevRoleId: collaboratorRole.customId,
    };

    newRoles.push(publicRole);
    newRoles.push(collaboratorRole);
    newRoles.push(adminRole);

    publicRole.nextRoleId = collaboratorRole.customId;
    collaboratorRole.nextRoleId = adminRole.customId;

    return newRoles;
}

export default async function initializeOrgRoles(
    ctx: IBaseContext,
    user: IUser,
    org: IBlock
): Promise<IAccessControlRole[]> {
    if (org.type !== BlockType.Org) {
        throw new Error(
            "Roles can only be default initialized in organizations"
        );
    }

    const blockRoles = await ctx.accessControl.getRolesByResourceId(
        ctx,
        org.customId
    );

    if (blockRoles.length > 0) {
        return [];
    }

    const newRoles = getDefaultOrgRoles(user.customId, org);

    return ctx.accessControl.saveRoles(ctx, newRoles);
}
