import {
    boardResourceTypeToActionList,
    IAccessControlPermission,
} from "../../mongo/access-control/definitions";
import { getPermissions2DimensionalMap } from "../../mongo/access-control/utils";
import { IBlock } from "../../mongo/block";
import { IUser } from "../../mongo/user";
import { getDate } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { IBaseContext } from "../contexts/BaseContext";

// export default async function initializeBlockPermissions(
//     ctx: IBaseContext,
//     user: IUser,
//     block: IBlock
// ): Promise<IAccessControlPermission[]> {
//     const roles = await ctx.accessControl.getRolesByResourceId(
//         ctx,
//         block.customId
//     );

//     if (roles.length === 0) {
//         throw new OperationError({
//             message: `${block.type} has no roles present`,
//         });
//     }

//     const existingPermissions = await ctx.accessControl.getPermissionsByResourceId(
//         ctx,
//         block.customId
//     );

//     const newPermissionItems = findPermissionsInBNotInA(
//         block.type === BlockType.Board
//             ? boardResourceTypeToActionList
//             : orgResourceTypeToActionList,
//         existingPermissions
//     );

//     if (newPermissionItems.length === 0) {
//         return [];
//     }

//     const newPermissions = newPermissionItems.map((p) => {
//         const permission: IAccessControlPermission = {
//             ...p,
//             customId: getNewId(),
//             roles: [],
//             users: [],
//             permissionOwnerId: block.customId,
//             createdBy: user.customId,
//             createdAt: getDate(),
//             available: false,
//         };

//         return permission;
//     });

//     return ctx.accessControl.savePermissions(ctx, newPermissions);
// }

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
    const boardPermissions = boardResourceTypeToActionList.map((p) => {
        const orgPermission = orgPermissionsMap[p.resourceType][p.action];
        const permission: IAccessControlPermission = {
            ...p,
            customId: getNewId(),
            roles: orgPermission.roles,
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
