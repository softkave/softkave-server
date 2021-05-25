import { GetPushSubscriptionKeysEndpoint } from "./types";

const getPushSubscriptionKeys: GetPushSubscriptionKeysEndpoint = async (
    context,
    instData
) => {
    return {
        vapidPublicKey: context.appVariables.vapidPublicKey,
    };
};

export default getPushSubscriptionKeys;
