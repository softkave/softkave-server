import { validate } from "../../../utilities/joiUtils";
import { subscribePushSubscriptionJoiSchema } from "../subscribe/validation";
import { PushSubscriptionExistsEndpoint } from "./types";

const pushSubscriptionExists: PushSubscriptionExistsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, subscribePushSubscriptionJoiSchema);
    const client = await context.client.getClientByPushSubscription(
        context,
        data.endpoint,
        data.keys
    );

    return {
        exists: !!client,
    };
};

export default pushSubscriptionExists;
