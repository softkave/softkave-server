import {
    boardResourceTypeToActionList,
    IAccessControlPermission,
    orgResourceTypeToActionList,
} from "../../mongo/access-control/definitions";
import { findPermissionsInBNotInA } from "../../mongo/access-control/utils";
import { BlockType, IBlock } from "../../mongo/block";
import { IUser } from "../../mongo/user";
import { getDate } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import OperationError from "../../utilities/OperationError";
import { IBaseContext } from "../contexts/BaseContext";

export default async function initializeBlockPermissions(
    ctx: IBaseContext,
    user: IUser,
    block: IBlock
): Promise<IAccessControlPermission[]> {
    const roles = await ctx.accessControl.getRolesByResourceId(
        ctx,
        block.customId
    );

    if (roles.length === 0) {
        throw new OperationError({ message: "Block has no roles present" });
    }

    const existingPermissions = await ctx.accessControl.getPermissionsByResourceId(
        ctx,
        block.customId
    );

    const newPermissionItems = findPermissionsInBNotInA(
        existingPermissions,
        block.type === BlockType.Board
            ? boardResourceTypeToActionList
            : orgResourceTypeToActionList
    );

    if (newPermissionItems.length === 0) {
        return [];
    }

    const newPermissions = newPermissionItems.map((p) => {
        const permission: IAccessControlPermission = {
            ...p,
            customId: getNewId(),
            roles: [],
            users: [],
            permissionOwnerId: block.customId,
            createdBy: user.customId,
            createdAt: getDate(),
            available: false,
        };

        return permission;
    });

    return ctx.accessControl.savePermissions(ctx, newPermissions);
}
