import makeSingletonFn from "../../utilities/createSingletonFunc";
import { wrapEndpointREST } from "../utils";
import getPushSubscriptionKeys from "./getPushSubscriptionKeys/handler";
import pushSubscriptionExists from "./pushSubscriptionExists/handler";
import subscribePushSubscription from "./subscribe/handler";
import unsubscribePushSubscription from "./unsubscribe/handler";

export default class PushSubscriptionsEndpointsGraphQLController {
    public subscribePushSubscription = wrapEndpointREST(
        subscribePushSubscription
    );
    public unsubscribePushSubscription = wrapEndpointREST(
        unsubscribePushSubscription
    );
    public pushSubscriptionExists = wrapEndpointREST(pushSubscriptionExists);
    public getPushSubscriptionKeys = wrapEndpointREST(getPushSubscriptionKeys);
}

export const getPushSubscriptionsEndpointsGraphQLController = makeSingletonFn(
    () => new PushSubscriptionsEndpointsGraphQLController()
);
