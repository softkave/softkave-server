import { SystemActionType, SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { validate } from "../../../utilities/joiUtils";
import {
    getBlockRootBlockId,
    getPublicNotificationsArray,
} from "../../block/utils";
import { GetResourceSubscriptionsEndpoint } from "./types";
import { getResourceSubscriptionsJoiSchema } from "./validation";

const getResourceSubscriptions: GetResourceSubscriptionsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, getResourceSubscriptionsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.getBlockById(context, data.blockId);

    assertBlock(block);
    await context.accessControl.assertPermission(
        context,
        getBlockRootBlockId(block),
        {
            resourceType: SystemResourceType.Notification,
            action: SystemActionType.Read,
            resourceId: block.customId,
        },
        user
    );

    const subscriptions = await context.notification.getNotificationSubscriptionsByResourceId(
        context,
        block.customId
    );

    return {
        subscriptions: getPublicNotificationsArray(subscriptions),
    };
};

export default getResourceSubscriptions;
