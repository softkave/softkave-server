import { getPublicNotificationsArray } from "../../notifications/utils";
import { GetCollaborationRequestsEndpoint } from "./types";

const getCollaborationRequests: GetCollaborationRequestsEndpoint = async (
    context,
    instData
) => {
    const user = await context.session.getUser(context, instData);
    const requests = await context.notification.getUserNotifications(
        context,
        user.email
    );

    return { notifications: getPublicNotificationsArray(requests) };
};

export default getCollaborationRequests;
