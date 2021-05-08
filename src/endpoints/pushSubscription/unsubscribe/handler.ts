import { UnsubscribePushSubscriptionEndpoint } from "./types";

const unsubscribePushSubscription: UnsubscribePushSubscriptionEndpoint = async (
    context,
    instData
) => {
    const user = await context.session.getUser(context, instData);
    await context.pushSubscription.deletePushSubscriptionsByUserAndClientId(
        context,
        user.customId,
        instData.clientId
    );
};

export default unsubscribePushSubscription;
