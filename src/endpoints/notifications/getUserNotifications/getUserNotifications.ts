import { getPublicNotificationsArray } from "../utils";
import { GetCollaborationRequestsEndpoint } from "./types";

const getUserNotifications: GetCollaborationRequestsEndpoint = async (
    context,
    instData
) => {
    const user = await context.session.getUser(context, instData);
    const notifications = await context.notification.getUserNotifications(
        context,
        user.customId
    );

    return { notifications: getPublicNotificationsArray(notifications) };
};

export default getUserNotifications;
