import { SystemActionType, SystemResourceType } from "../../../models/system";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { BlockType } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
import { InvalidRequestError } from "../../errors";
import { getPublicPermissionsArray } from "../utils";
import { GetResourcePermissionsEndpoint } from "./types";
import { getResourcePermissionsJoiSchema } from "./validation";

// TODO: only return what pertains to the user
// that is, only return the user's permissionGroup id or user id
// OR only return the permissions the user has access to

const getResourcePermissions: GetResourcePermissionsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, getResourcePermissionsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.assertGetBlockById(context, data.blockId);

    assertBlock(block);

    if (
        block.type !== BlockType.Organization &&
        block.type !== BlockType.Board
    ) {
        throw new InvalidRequestError();
    }

    await context.accessControl.assertPermission(
        context,
        {
            organizationId: getBlockRootBlockId(block),
            resourceType: getBlockAuditLogResourceType(block),
            action: SystemActionType.Read,
            permissionResourceId: block.permissionResourceId,
        },
        user
    );

    const permissions = await context.accessControl.getPermissionsByResourceId(
        context,
        block.customId,
        true
    );

    return {
        permissions: getPublicPermissionsArray(permissions),
    };
};

export default getResourcePermissions;
