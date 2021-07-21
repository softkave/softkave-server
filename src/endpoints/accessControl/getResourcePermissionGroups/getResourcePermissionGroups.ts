import { SystemActionType, SystemResourceType } from "../../../models/system";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { BlockType } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
import { InvalidRequestError } from "../../errors";
import { getPublicPermissionGroupsArray } from "../utils";
import { GetResourcePermissionGroupsEndpoint } from "./types";
import { getPermissionGroupsJoiSchema } from "./validation";

const getResourcePermissionGroups: GetResourcePermissionGroupsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, getPermissionGroupsJoiSchema);
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

    const permissionGroups =
        await context.accessControl.getPermissionGroupsByResourceId(
            context,
            block.customId
        );

    return {
        permissionGroups: getPublicPermissionGroupsArray(permissionGroups),
    };
};

export default getResourcePermissionGroups;
