import makeSingletonFn from "../../utilities/createSingletonFunc";

export default class NotificationEndpointsGraphQLController {}

export const getNotificationEndpointsGraphQLController = makeSingletonFn(
    () => new NotificationEndpointsGraphQLController()
);
