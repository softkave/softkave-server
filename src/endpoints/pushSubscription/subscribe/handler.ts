import { getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { PushSubscriptionExistsError } from "../errors";
import { SubscribePushSubscriptionEndpoint } from "./types";
import { subscribePushSubscriptionJoiSchema } from "./validation";

const subscribePushSubscription: SubscribePushSubscriptionEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, subscribePushSubscriptionJoiSchema);
    const client = await context.session.getClient(context, instData);
    const existingSubscription =
        await context.client.getClientByPushSubscription(
            context,
            data.endpoint,
            data.keys
        );

    if (existingSubscription) {
        throw new PushSubscriptionExistsError();
    }

    await context.client.updateClientById(context, client.clientId, {
        endpoint: data.endpoint,
        keys: data.keys,
        pushSubscribedAt: getDateString(),
    });
};

export default subscribePushSubscription;
