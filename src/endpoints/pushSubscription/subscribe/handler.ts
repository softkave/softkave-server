import { getDateString } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { PushSubscriptionExistsError } from "../errors";
import { SubscribePushSubscriptionEndpoint } from "./types";
import { subscribePushSubscriptionJoiSchema } from "./validation";

const subscribePushSubscription: SubscribePushSubscriptionEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, subscribePushSubscriptionJoiSchema);
    const user = await context.session.getUser(context, instData);
    const existingSubscription = await context.pushSubscription.getPushSubscription(
        context,
        user.customId,
        instData.client.clientId,
        data.endpoint,
        data.keys
    );

    if (existingSubscription) {
        throw new PushSubscriptionExistsError();
    }

    // just to make sure, there should be only one push subscription for a client
    // per user
    await context.pushSubscription.deletePushSubscriptionsByUserAndClientId(
        context,
        user.customId,
        instData.clientId
    );

    await context.pushSubscription.savePushSubscription(context, {
        clientId: instData.client.clientId,
        createdAt: getDateString(),
        customId: getNewId(),
        endpoint: data.endpoint,
        keys: data.keys,
        userId: user.customId,
    });
};

export default subscribePushSubscription;
