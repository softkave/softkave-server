import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import getPushSubscriptionKeys from "./getPushSubscriptionKeys/handler";
import pushSubscriptionExists from "./pushSubscriptionExists/handler";
import subscribePushSubscription from "./subscribe/handler";
import unsubscribePushSubscription from "./unsubscribe/handler";

export default class PushSubscriptionsEndpointsGraphQLController {
    public subscribePushSubscription(data, req) {
        return wrapEndpoint(data, req, async () =>
            subscribePushSubscription(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public unsubscribePushSubscription(data, req) {
        return wrapEndpoint(data, req, async () =>
            unsubscribePushSubscription(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public pushSubscriptionExists(data, req) {
        return wrapEndpoint(data, req, async () =>
            pushSubscriptionExists(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public getPushSubscriptionKeys(data, req) {
        return wrapEndpoint(data, req, async () =>
            getPushSubscriptionKeys(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }
}

export const getPushSubscriptionsEndpointsGraphQLController = makeSingletonFunc(
    () => new PushSubscriptionsEndpointsGraphQLController()
);
