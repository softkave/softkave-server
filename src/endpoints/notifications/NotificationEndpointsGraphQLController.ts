import makeSingletonFunc from "../../utilities/createSingletonFunc";

export default class NotificationEndpointsGraphQLController {}

export const getNotificationEndpointsGraphQLController = makeSingletonFunc(
    () => new NotificationEndpointsGraphQLController()
);
