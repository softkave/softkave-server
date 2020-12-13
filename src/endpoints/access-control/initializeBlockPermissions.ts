import { SystemActionType, SystemResourceType } from "../../models/system";
import {
    DefaultPermissionGroupNames,
    boardResourceTypesToActionList,
    IPermission,
    IPermissionGroup,
} from "../../mongo/access-control/definitions";
import { getPermissions2DimensionalMap } from "../../mongo/access-control/utils";
import { getBlockAuditLogResourceType } from "../../mongo/audit-log/utils";
import { IBlock } from "../../mongo/block";
import { IUser } from "../../mongo/user";
import { getDate, getDateString } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { IBaseContext } from "../contexts/BaseContext";

export async function initializeBoardPermissions(
    ctx: IBaseContext,
    user: IUser,
    board: IBlock
) {
    if (board.permissionResourceId === board.customId) {
        return;
    }

    const orgPermissions = await ctx.accessControl.getPermissionsByResourceId(
        ctx,
        board.rootBlockId!
    );

    const orgPermissionsMap = getPermissions2DimensionalMap(orgPermissions);
    const boardPermissions = boardResourceTypesToActionList.map((p) => {
        const orgPermission = orgPermissionsMap[p.resourceType][p.action];
        const permission: IPermission = {
            ...p,
            customId: getNewId(),
            orgId: board.rootBlockId,
            permissionGroups: orgPermission.permissionGroups,
            users: orgPermission.users,
            permissionOwnerId: board.customId,
            createdBy: user.customId,
            createdAt: getDate(),
            available: true,
        };

        return permission;
    });

    await ctx.accessControl.savePermissions(ctx, boardPermissions);
    await ctx.block.updateBlockById(ctx, board.customId, {
        permissionResourceId: board.customId,
    });
}

const publicPermissionGroupName = DefaultPermissionGroupNames.Public.toLowerCase();
const publicPermissionGroupDescription = "";

const collaboratorPermissionGroupName = DefaultPermissionGroupNames.Collaborator.toLowerCase();
const collaboratorPermissionGroupDescription = "";

const adminPermissionGroupName = DefaultPermissionGroupNames.Admin.toLowerCase();
const adminPermissionGroupDescription = "";

export function getDefaultOrgPermissionGroups(userId: string, org: IBlock) {
    const newPermissionGroups: IPermissionGroup[] = [];
    const publicPermissionGroup: IPermissionGroup = {
        customId: getNewId(),
        name: publicPermissionGroupName,
        lowerCasedName: publicPermissionGroupName,
        description: publicPermissionGroupDescription,
        createdBy: userId,
        createdAt: getDateString(),
        resourceId: org.customId,
        resourceType: getBlockAuditLogResourceType(org),
    };

    const collaboratorPermissionGroup: IPermissionGroup = {
        customId: getNewId(),
        name: collaboratorPermissionGroupName,
        lowerCasedName: collaboratorPermissionGroupName,
        description: collaboratorPermissionGroupDescription,
        createdBy: userId,
        createdAt: getDateString(),
        resourceId: org.customId,
        resourceType: getBlockAuditLogResourceType(org),
        prevId: publicPermissionGroup.customId,
    };

    const adminPermissionGroup: IPermissionGroup = {
        customId: getNewId(),
        name: adminPermissionGroupName,
        lowerCasedName: adminPermissionGroupName,
        description: adminPermissionGroupDescription,
        createdBy: userId,
        createdAt: getDateString(),
        resourceId: org.customId,
        resourceType: getBlockAuditLogResourceType(org),
        prevId: collaboratorPermissionGroup.customId,
    };

    newPermissionGroups.push(publicPermissionGroup);
    newPermissionGroups.push(collaboratorPermissionGroup);
    newPermissionGroups.push(adminPermissionGroup);

    publicPermissionGroup.nextId = collaboratorPermissionGroup.customId;
    collaboratorPermissionGroup.nextId = adminPermissionGroup.customId;

    return {
        publicPermissionGroup,
        collaboratorPermissionGroup,
        adminPermissionGroup,
        permissionGroups: newPermissionGroups,
    };
}

interface IDefaultPermissionGroupsToPermissionsMap {
    resourceType: SystemResourceType;
    action: SystemActionType;
    permissionGroups: DefaultPermissionGroupNames[];
}

type IProvidedDefaultPermissionGroupsMap = Record<
    DefaultPermissionGroupNames,
    IPermissionGroup
>;

function getP(
    resourceType,
    actions = [
        SystemActionType.Create,
        SystemActionType.Read,
        SystemActionType.Update,
        SystemActionType.Delete,
    ],
    permissionGroups = [
        DefaultPermissionGroupNames.Admin,
        DefaultPermissionGroupNames.Collaborator,
    ]
): IDefaultPermissionGroupsToPermissionsMap[] {
    return actions.map((action) => {
        return {
            action,
            resourceType,
            permissionGroups,
        };
    });
}

const defaultPermissionGroupsToPermissionsList = [
    // Collaborator
    ...getP(
        SystemResourceType.Collaborator,
        [SystemActionType.RemoveCollaborator],
        [DefaultPermissionGroupNames.Admin]
    ),

    // Org
    ...getP(SystemResourceType.Org, [
        SystemActionType.Read,
        SystemActionType.Update,
    ]),
    ...getP(
        SystemResourceType.Org,
        [SystemActionType.Delete],
        [DefaultPermissionGroupNames.Admin]
    ),

    // Board
    ...getP(SystemResourceType.Board, [
        SystemActionType.Create,
        SystemActionType.Read,
        SystemActionType.Update,
    ]),
    ...getP(
        SystemResourceType.Board,
        [SystemActionType.Delete],
        [DefaultPermissionGroupNames.Admin]
    ),

    // Task
    ...getP(SystemResourceType.Task),

    // Status
    ...getP(SystemResourceType.Status),

    // Label
    ...getP(SystemResourceType.Label),

    // Resolution
    ...getP(SystemResourceType.Resolution),

    // Note
    ...getP(SystemResourceType.Note),

    // Comment
    ...getP(SystemResourceType.Comment),

    // Room
    ...getP(SystemResourceType.Room),

    // Sprint
    ...getP(SystemResourceType.Sprint),

    // Chat
    ...getP(SystemResourceType.Chat),

    // Sub-task
    ...getP(SystemResourceType.SubTask),

    // Collaboration request
    ...getP(SystemResourceType.CollaborationRequest, [SystemActionType.Read]),
    ...getP(
        SystemResourceType.CollaborationRequest,
        [
            SystemActionType.Create,
            SystemActionType.Update,
            SystemActionType.RevokeRequest,
        ],
        [DefaultPermissionGroupNames.Admin]
    ),

    // Notification
    ...getP(SystemResourceType.Notification, [SystemActionType.Read]),

    // Notification subscription
    ...getP(SystemResourceType.NotificationSubscription, [
        SystemActionType.Read,
        SystemActionType.Update,
    ]),

    // Team
    ...getP(SystemResourceType.Team, [
        SystemActionType.Create,
        SystemActionType.Read,
        SystemActionType.Update,
    ]),
    ...getP(
        SystemResourceType.Team,
        [SystemActionType.Delete],
        [DefaultPermissionGroupNames.Admin]
    ),

    // PermissionGroup
    ...getP(SystemResourceType.PermissionGroup, [SystemActionType.Read]),
    ...getP(
        SystemResourceType.PermissionGroup,
        [
            SystemActionType.Create,
            SystemActionType.Update,
            SystemActionType.Delete,
        ],
        [DefaultPermissionGroupNames.Admin]
    ),

    // Permission
    ...getP(SystemResourceType.Permission, [SystemActionType.Read]),
    ...getP(
        SystemResourceType.Permission,
        [SystemActionType.Update],
        [DefaultPermissionGroupNames.Admin]
    ),
];

export function makeDefaultPermissions(
    userId: string,
    org: IBlock,
    defaultPermissionGroupsMap: IProvidedDefaultPermissionGroupsMap
) {
    const defaultPermissionsMap = getPermissions2DimensionalMap(
        defaultPermissionGroupsToPermissionsList
    );

    const permissions = boardResourceTypesToActionList.map((p) => {
        const defaultPermission =
            defaultPermissionsMap[p.resourceType][p.action];

        const permission: IPermission = {
            ...p,
            customId: getNewId(),
            permissionGroups: defaultPermission.permissionGroups.map(
                (name) => defaultPermissionGroupsMap[name].customId
            ),
            users: [],
            permissionOwnerId: org.customId,
            createdBy: userId,
            createdAt: getDate(),
            available: true,
            orgId: org.customId,
        };

        return permission;
    });

    return permissions;
}

export async function initializeOrgAccessControl(
    ctx: IBaseContext,
    user: IUser,
    org: IBlock
) {
    const {
        permissionGroups,
        adminPermissionGroup,
        publicPermissionGroup,
        collaboratorPermissionGroup,
    } = getDefaultOrgPermissionGroups(user.customId, org);

    const permissions = makeDefaultPermissions(user.customId, org, {
        [DefaultPermissionGroupNames.Admin]: adminPermissionGroup,
        [DefaultPermissionGroupNames.Collaborator]: collaboratorPermissionGroup,
        [DefaultPermissionGroupNames.Public]: publicPermissionGroup,
    });

    const p1 = ctx.accessControl.savePermissionGroups(ctx, permissionGroups);
    const p2 = ctx.accessControl.savePermissions(ctx, permissions);

    await Promise.all([p1, p2]);

    org = await ctx.block.updateBlockById(ctx, org.customId, {
        publicPermissionGroupId: publicPermissionGroup.customId,
    });

    return {
        permissionGroups,
        permissions,
        org,
    };
}
