import { getPublicCollaborationRequestArray } from "../utils";
import { GetUserRequestsEndpoint } from "./types";

const getUserRequests: GetUserRequestsEndpoint = async (context, instData) => {
    const user = await context.session.getUser(context, instData);
    const requests =
        await context.collaborationRequest.getUserCollaborationRequests(
            context,
            user.email
        );

    return {
        requests: getPublicCollaborationRequestArray(requests),
    };
};

export default getUserRequests;
