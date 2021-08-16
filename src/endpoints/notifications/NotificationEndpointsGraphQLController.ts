import getSingletonFunc from "../../utilities/createSingletonFunc";

export default class NotificationEndpointsGraphQLController {}

export const getNotificationEndpointsGraphQLController = getSingletonFunc(
    () => new NotificationEndpointsGraphQLController()
);
