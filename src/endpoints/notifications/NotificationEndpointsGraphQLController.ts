import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import getResourceSubscriptions from "./getResourceSubscriptions/getResourceSubscriptions";
import getUserNotifications from "./getUserNotifications/getUserNotifications";
import markNotificationsRead from "./markNotificationsRead/markNotificationsRead";

export default class NotificationEndpointsGraphQLController {
    public getResourceSubscriptions(data, req) {
        return wrapEndpoint(data, req, () =>
            getResourceSubscriptions(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public getUserNotifications(data, req) {
        return wrapEndpoint(data, req, () =>
            getUserNotifications(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public markNotificationsRead(data, req) {
        return wrapEndpoint(data, req, () =>
            markNotificationsRead(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }
}

export const getNotificationEndpointsGraphQLController = makeSingletonFunc(
    () => new NotificationEndpointsGraphQLController()
);
