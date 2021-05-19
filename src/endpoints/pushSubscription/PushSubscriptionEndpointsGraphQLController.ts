import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import getPushNotificationKeys from "./getPushNotificationKeys/handler";
import pushSubscriptionExists from "./pushNotificationExists/handler";
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

    public getPushNotificationKeys(data, req) {
        return wrapEndpoint(data, req, async () =>
            getPushNotificationKeys(
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
