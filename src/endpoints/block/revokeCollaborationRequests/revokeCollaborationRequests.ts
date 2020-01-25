import { validate } from "utils/joiUtils";
import { IRevokeCollaborationRequestsContext } from "./types";
import { revokeRequestJoiSchema } from "./validation";

async function revokeCollaborationRequests(
  context: IRevokeCollaborationRequestsContext
): Promise<void> {
  const data = validate(context.data, revokeRequestJoiSchema);

  await context.revokeCollaborationRequestsInDatabase(data.requestID);
}

export default revokeCollaborationRequests;
