import { UnsubscribePushSubscriptionEndpoint } from "./types";

const unsubscribePushSubscription: UnsubscribePushSubscriptionEndpoint = async (
    context,
    instData
) => {
    const client = await context.session.getClient(context, instData);
    await context.client.updateClientById(context, client.clientId, {
        endpoint: null,
        keys: null,
    });
};

export default unsubscribePushSubscription;
