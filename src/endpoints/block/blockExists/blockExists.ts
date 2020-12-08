import { SystemActionType } from "../../../models/system";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { BlockType } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import { validate } from "../../../utilities/joiUtils";
import { InvalidRequestError } from "../../errors";
import { getBlockRootBlockId } from "../utils";
import { BlockExistsEndpoint } from "./types";
import { blockExistsJoiSchema } from "./validation";

const blockExists: BlockExistsEndpoint = async (context, instData) => {
    const data = validate(instData.data, blockExistsJoiSchema);
    const user = await context.session.getUser(context, instData);

    if (data.type !== BlockType.Org) {
        if (!data.parent) {
            throw new InvalidRequestError({
                message: "Parent ID not provided",
            });
        }

        const parent = await context.block.getBlockById(context, data.parent);

        assertBlock(parent);
        await context.accessControl.assertPermission(
            context,
            {
                orgId: getBlockRootBlockId(parent),
                resourceType: getBlockAuditLogResourceType(parent),
                action: SystemActionType.Read,
                permissionResourceId: parent.permissionResourceId,
            },
            user
        );
    }

    const exists = await context.block.blockExists(
        context,
        data.name,
        data.type,
        data.parent
    );

    return { exists };
};

export default blockExists;
