import {
  IGetCollaborationRequestsContext,
  IGetCollaborationRequestsResult
} from "./types";

async function getCollaborationRequests(
  context: IGetCollaborationRequestsContext
): Promise<IGetCollaborationRequestsResult> {
  const user = await context.getUser();
  const requests = await context.getCollaborationRequestsFromDatabase(
    user.email
  );

  return { requests };
}

export default getCollaborationRequests;
