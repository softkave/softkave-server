import { getPublicNotificationsArray } from "../utils";
import { GetCollaborationRequestsEndpoint } from "./types";

const getCollaborationRequests: GetCollaborationRequestsEndpoint = async (
    context,
    instData
) => {
    const user = await context.session.getUser(context, instData);
    const requests = await context.notification.getUserCollaborationRequests(
        context,
        user.email
    );

    return { notifications: getPublicNotificationsArray(requests) };
};

export default getCollaborationRequests;
