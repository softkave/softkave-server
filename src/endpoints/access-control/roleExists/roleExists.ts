import { SystemActionType } from "../../../models/system";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
import { assertIsPermissionBlock } from "../utils";
import { RoleExistsEndpoint } from "./types";
import { roleExistsJoiSchema } from "./validation";

const roleExists: RoleExistsEndpoint = async (context, instData) => {
    const data = validate(instData.data, roleExistsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.assertGetBlockById(context, data.blockId);

    assertIsPermissionBlock(block);

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

    const roles = await context.accessControl.getRolesByLowerCasedNames(
        context,
        [block.customId],
        [data.name.toLowerCase()]
    );

    const exists = !!roles[0];

    return { exists };
};

export default roleExists;
