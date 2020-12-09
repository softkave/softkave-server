import { SystemActionType, SystemResourceType } from "../../../models/system";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { BlockType } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
import { InvalidRequestError } from "../../errors";
import { getPublicPermissionsArray } from "../utils";
import { GetPermissionsEndpoint } from "./types";
import { getPermissionsJoiSchema } from "./validation";

const getPermissions: GetPermissionsEndpoint = async (context, instData) => {
    const data = validate(instData.data, getPermissionsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.assertGetBlockById(context, data.blockId);

    assertBlock(block);

    if (block.type !== BlockType.Org && block.type !== BlockType.Board) {
        throw new InvalidRequestError();
    }

    await context.accessControl.assertPermission(
        context,
        {
            orgId: getBlockRootBlockId(block),
            resourceType: getBlockAuditLogResourceType(block),
            action: SystemActionType.Read,
            permissionResourceId: block.permissionResourceId,
        },
        user
    );

    const permissions = await context.accessControl.getPermissionsByResourceId(
        context,
        block.customId
    );

    return {
        permissions: getPublicPermissionsArray(permissions),
    };
};

export default getPermissions;
