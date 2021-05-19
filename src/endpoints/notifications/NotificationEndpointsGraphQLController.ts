import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import getResourceSubscriptions from "./getResourceSubscriptions/getResourceSubscriptions";
import markNotificationsRead from "./markNotificationsRead/markNotificationsRead";

export default class NotificationEndpointsGraphQLController {
    public getResourceSubscriptions(data, req) {
        return wrapEndpoint(data, req, async () =>
            getResourceSubscriptions(
                getBaseContext(),
                await RequestData.fromExpressRequest(
                    getBaseContext(),
                    req,
                    data
                )
            )
        );
    }

    public markNotificationsRead(data, req) {
        return wrapEndpoint(data, req, async () =>
            markNotificationsRead(
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

export const getNotificationEndpointsGraphQLController = makeSingletonFunc(
    () => new NotificationEndpointsGraphQLController()
);
