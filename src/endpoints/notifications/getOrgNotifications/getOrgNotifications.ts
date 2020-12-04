import { SystemActionType, SystemResourceType } from "../../../models/system";
import { BlockType } from "../../../mongo/block";
import { assertBlock, assertBlockType } from "../../../mongo/block/utils";
import { validate } from "../../../utilities/joiUtils";
import { getPublicNotificationsArray } from "../utils";
import { GetOrgNotificationsEndpoint } from "./types";
import { getOrgNotificationsJoiSchema } from "./validation";

const getOrgNotifications: GetOrgNotificationsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, getOrgNotificationsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const org = await context.block.getBlockById(context, data.orgId);

    assertBlock(org);
    assertBlockType(org, BlockType.Org);

    await context.accessControl.assertPermission(
        context,
        org.customId,
        {
            resourceType: SystemResourceType.Notification,
            action: SystemActionType.Read,
            resourceId: org.customId,
        },
        user
    );

    const notifications = await context.notification.getNotificationsByOrgId(
        context,
        org.customId
    );

    return {
        notifications: getPublicNotificationsArray(notifications),
    };
};

export default getOrgNotifications;
