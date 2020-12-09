import { SystemActionType, SystemResourceType } from "../../../models/system";
import { IAccessControlRole } from "../../../mongo/access-control/definitions";
import { IUser } from "../../../mongo/user";
import { indexArray } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
import { IBaseContext } from "../../contexts/BaseContext";
import {
    IOutgoingUpdateBlockRolesPacket,
    OutgoingSocketEvents,
} from "../../socket/outgoingEventTypes";
import { assertIsPermissionBlock } from "../utils";
import { DeleteRolesEndpoint } from "./types";
import { setRolesJoiSchema } from "./validation";

async function removeDeletedRolesInUsers(
    context: IBaseContext,
    orgId: string,
    user: IUser,
    users: IUser[],
    deletedRoles: IAccessControlRole[]
) {
    const deletedRolesMap = indexArray(deletedRoles, { path: "customId" });

    users.forEach((u) => {
        const orgData = u.orgs.find((org) => org.customId === orgId);
        const roleIds = orgData.roles || [];
        const userDeletedRoles: IAccessControlRole[] = [];

        roleIds.forEach((id) => {
            const role = deletedRolesMap[id];

            if (role) {
                userDeletedRoles.push(role);
            }
        });

        if (userDeletedRoles.length === 0) {
            return;
        }
    });
}

function notifyUsersOfDeletedRolesAndUpdatedPermissions() {}

const deleteRoles: DeleteRolesEndpoint = async (context, instData) => {
    const data = validate(instData.data, setRolesJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.assertGetBlockById(context, data.blockId);

    assertIsPermissionBlock(block);
    await context.accessControl.assertPermission(
        context,
        {
            orgId: getBlockRootBlockId(block),
            resourceType: SystemResourceType.Role,
            action: SystemActionType.Update,
            permissionResourceId: block.permissionResourceId,
        },
        user
    );

    await context.accessControl.deleteRoles(context, data.roles);

    const roomName = context.room.getBlockRoomName(block.type, block.customId);
    const updatePacket: IOutgoingUpdateBlockRolesPacket = {
        remove: data.roles,
        blockId: block.customId,
    };

    context.room.broadcast(
        context,
        roomName,
        OutgoingSocketEvents.UpdateBlockRoles,
        updatePacket,
        instData
    );
};

export default deleteRoles;
