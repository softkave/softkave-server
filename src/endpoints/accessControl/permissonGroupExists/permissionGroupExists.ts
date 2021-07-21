import { SystemActionType } from "../../../models/system";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
import { assertIsPermissionBlock } from "../utils";
import { PermissionGroupExistsEndpoint } from "./types";
import { permissionGroupExistsJoiSchema } from "./validation";

const permissionGroupExists: PermissionGroupExistsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, permissionGroupExistsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.assertGetBlockById(context, data.blockId);

    assertIsPermissionBlock(block);

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
        await context.accessControl.getPermissionGroupsByLowerCasedNames(
            context,
            [block.customId],
            [data.name.toLowerCase()]
        );

    const exists = !!permissionGroups[0];

    return { exists };
};

export default permissionGroupExists;
