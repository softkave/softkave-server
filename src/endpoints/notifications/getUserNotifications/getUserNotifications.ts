import {
    getPublicCollaborationRequestArray,
    getPublicNotificationsArray,
} from "../utils";
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

    const requests = await context.collaborationRequest.getUserCollaborationRequests(
        context,
        user.email
    );

    return {
        notifications: getPublicNotificationsArray(notifications),
        requests: getPublicCollaborationRequestArray(requests),
    };
};

export default getUserNotifications;
