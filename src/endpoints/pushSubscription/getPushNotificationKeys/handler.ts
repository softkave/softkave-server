import { GetPushNotificationKeysEndpoint } from "./types";

const getPushNotificationKeys: GetPushNotificationKeysEndpoint = async (
    context,
    instData
) => {
    return {
        vapidPublicKey: context.appVariables.vapidPublicKey,
    };
};

export default getPushNotificationKeys;
