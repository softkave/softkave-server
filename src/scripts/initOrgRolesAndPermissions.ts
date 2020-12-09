import { getDefaultOrgRoles } from "../endpoints/access-control/initializeOrgRoles";
import { SystemActionType, SystemResourceType } from "../models/system";
import { getAccessControlPermissionModel } from "../mongo/access-control/AccessControlActionsMapModel";
import { getAccessControlRoleModel } from "../mongo/access-control/AccessControlRoleModel";
import {
    AccessControlDefaultRoles,
    boardResourceTypeToActionList,
    IAccessControlPermission,
    IAccessControlRole,
} from "../mongo/access-control/definitions";
import { getPermissions2DimensionalMap } from "../mongo/access-control/utils";
import {
    BlockType,
    getBlockModel,
    IBlock,
    IBlockDocument,
} from "../mongo/block";
import { getDate } from "../utilities/fns";
import getNewId from "../utilities/getNewId";
import {
    logScriptFailed,
    logScriptStarted,
    logScriptSuccessful,
} from "./utils";

interface IDefaultRolesToPermissionsMap {
    resourceType: SystemResourceType;
    action: SystemActionType;
    roles: AccessControlDefaultRoles[];
}

type IProvidedDefaultRolesMap = Record<
    AccessControlDefaultRoles,
    IAccessControlRole
>;

function getP(
    resourceType,
    actions = [
        SystemActionType.Create,
        SystemActionType.Read,
        SystemActionType.Update,
        SystemActionType.Delete,
    ],
    roles = [
        AccessControlDefaultRoles.Admin,
        AccessControlDefaultRoles.Collaborator,
    ]
): IDefaultRolesToPermissionsMap[] {
    return actions.map((action) => {
        return {
            action,
            resourceType,
            roles,
        };
    });
}

const defaultRolesToPermissionsList = [
    // Collaborator
    ...getP(
        SystemResourceType.Collaborator,
        [SystemActionType.RemoveCollaborator],
        [AccessControlDefaultRoles.Admin]
    ),

    // Org
    ...getP(SystemResourceType.Org, [
        SystemActionType.Read,
        SystemActionType.Update,
    ]),
    ...getP(
        SystemResourceType.Org,
        [SystemActionType.Delete],
        [AccessControlDefaultRoles.Admin]
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
        [AccessControlDefaultRoles.Admin]
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
        [AccessControlDefaultRoles.Admin]
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
        [AccessControlDefaultRoles.Admin]
    ),

    // Role
    ...getP(SystemResourceType.Role, [SystemActionType.Read]),
    ...getP(
        SystemResourceType.Role,
        [
            SystemActionType.Create,
            SystemActionType.Update,
            SystemActionType.Delete,
        ],
        [AccessControlDefaultRoles.Admin]
    ),

    // Permission
    ...getP(SystemResourceType.Permission, [SystemActionType.Read]),
    ...getP(
        SystemResourceType.Permission,
        [SystemActionType.Update],
        [AccessControlDefaultRoles.Admin]
    ),
];

function makeDefaultPermissions(
    userId: string,
    org: IBlock,
    defaultRolesMap: IProvidedDefaultRolesMap
) {
    const defaultPermissionsMap = getPermissions2DimensionalMap(
        defaultRolesToPermissionsList
    );

    const permissions = boardResourceTypeToActionList.map((p) => {
        const defaultPermission =
            defaultPermissionsMap[p.resourceType][p.action];

        const permission: IAccessControlPermission = {
            ...p,
            customId: getNewId(),
            roles: defaultPermission.roles.map(
                (name) => defaultRolesMap[name].customId
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

export async function initOrgRolesAndPermissions() {
    logScriptStarted(initOrgRolesAndPermissions);

    const blockModel = getBlockModel();
    const roleModel = getAccessControlRoleModel();
    const permissionModel = getAccessControlPermissionModel();

    await blockModel.model.ensureIndexes();

    const cursor = blockModel.model.find({ type: BlockType.Org }).cursor();
    let docsCount = 0;

    try {
        for (
            let doc: IBlockDocument = await cursor.next();
            doc !== null;
            doc = await cursor.next()
        ) {
            if (doc.permissionResourceId) {
                continue;
            }

            const {
                roles,
                adminRole,
                publicRole,
                collaboratorRole,
            } = getDefaultOrgRoles(doc.createdBy, doc);

            const permissions = makeDefaultPermissions(doc.createdBy, doc, {
                [AccessControlDefaultRoles.Admin]: adminRole,
                [AccessControlDefaultRoles.Collaborator]: collaboratorRole,
                [AccessControlDefaultRoles.Public]: publicRole,
            });

            await roleModel.model.insertMany(roles);
            await permissionModel.model.insertMany(permissions);
            await blockModel.model
                .updateMany(
                    { rootBlockId: doc.customId },
                    { permissionResourceId: doc.customId }
                )
                .exec();

            doc.permissionResourceId = doc.customId;
            doc.publicRoleId = publicRole.customId;
            await doc.save();

            docsCount++;
        }

        cursor.close();

        console.log(`org(s) count = ${docsCount}`);
        logScriptSuccessful(initOrgRolesAndPermissions);
    } catch (error) {
        logScriptFailed(initOrgRolesAndPermissions, error);
    }
}
