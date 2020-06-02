import { GetCollaborationRequestsEndpoint } from "./types";

const getCollaborationRequests: GetCollaborationRequestsEndpoint = async (
  context,
  instData
) => {
  const user = await context.session.getUser(context.models, instData);
  const requests = await context.notification.getUserNotifications(
    context.models,
    user.email
  );

  return { notifications: requests };
};

export default getCollaborationRequests;
