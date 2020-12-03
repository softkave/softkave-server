import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import getOrgNotifications from "./getOrgNotifications/getOrgNotifications";
import getResourceSubscriptions from "./getResourceSubscriptions/getResourceSubscriptions";
import markNotificationRead from "./markNotificationRead/markNotificationRead";
import updateResourceSubscriptions from "./updateResourceSubscriptions/updateResourceSubscriptions";

export default class NotificationEndpointsGraphQLController {
    public getOrgNotifications(data, req) {
        return wrapEndpoint(data, req, () =>
            getOrgNotifications(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

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

    public markNotificationRead(data, req) {
        return wrapEndpoint(data, req, () =>
            markNotificationRead(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public updateResourceSubscriptions(data, req) {
        return wrapEndpoint(data, req, () =>
            updateResourceSubscriptions(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }
}

export const getNotificationEndpointsGraphQLController = makeSingletonFunc(
    () => new NotificationEndpointsGraphQLController()
);
