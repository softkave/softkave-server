import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
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
                    data,
                    { checkUserToken: true }
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
                    data,
                    { checkUserToken: true }
                )
            )
        );
    }
}

export const getPushSubscriptionsEndpointsGraphQLController = makeSingletonFunc(
    () => new PushSubscriptionsEndpointsGraphQLController()
);
