import { SystemActionType, SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../../block/utils";
import { getPublicNotificationSubscriptionsArray } from "../utils";
import { UpdateValueEndpoint } from "./types";
import { getResourceSubscriptionsJoiSchema } from "./validation";

const getResourceSubscriptions: UpdateValueEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, getResourceSubscriptionsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.getBlockById(context, data.blockId);

    assertBlock(block);
    await context.accessControl.assertPermission(
        context,
        {
            organizationId: getBlockRootBlockId(block),
            resourceType: SystemResourceType.Notification,
            action: SystemActionType.Read,
            permissionResourceId: block.customId,
        },
        user
    );

    const subscriptions =
        await context.notification.getNotificationSubscriptionsByResourceId(
            context,
            block.customId
        );

    return {
        subscriptions: getPublicNotificationSubscriptionsArray(subscriptions),
    };
};

export default getResourceSubscriptions;
