import {
    AccessControlDefaultRoles,
    IAccessControlRole,
} from "../../mongo/access-control/definitions";
import { getBlockAuditLogResourceType } from "../../mongo/audit-log/utils";
import { IBlock } from "../../mongo/block";
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

export default async function initializeBlockRoles(
    ctx: IBaseContext,
    user: IUser,
    block: IBlock
): Promise<IAccessControlRole[]> {
    const blockRoles = await ctx.accessControl.getRolesByResourceId(
        ctx,
        block.customId
    );

    if (blockRoles.length > 0) {
        return [];
    }

    const newRoles: IAccessControlRole[] = [];

    const publicRole: IAccessControlRole = {
        customId: getNewId(),
        name: publicRoleName,
        lowerCasedName: publicRoleName,
        description: publicRoleDescription,
        createdBy: user.customId,
        createdAt: getDate(),
        resourceId: block.customId,
        resourceType: getBlockAuditLogResourceType(block),
    };

    const collaboratorRole: IAccessControlRole = {
        customId: getNewId(),
        name: collaboratorRoleName,
        lowerCasedName: collaboratorRoleName,
        description: collaboratorRoleDescription,
        createdBy: user.customId,
        createdAt: getDate(),
        resourceId: block.customId,
        resourceType: getBlockAuditLogResourceType(block),
        prevRoleId: publicRole.customId,
    };

    const adminRole: IAccessControlRole = {
        customId: getNewId(),
        name: adminRoleName,
        lowerCasedName: adminRoleName,
        description: adminRoleDescription,
        createdBy: user.customId,
        createdAt: getDate(),
        resourceId: block.customId,
        resourceType: getBlockAuditLogResourceType(block),
        prevRoleId: collaboratorRole.customId,
    };

    newRoles.push(publicRole);
    newRoles.push(collaboratorRole);
    newRoles.push(adminRole);

    publicRole.nextRoleId = collaboratorRole.customId;
    collaboratorRole.nextRoleId = adminRole.customId;

    return ctx.accessControl.saveRoles(ctx, newRoles);
}
