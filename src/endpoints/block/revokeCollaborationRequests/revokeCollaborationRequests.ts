import { validate } from "../../../utilities/joiUtils";
import { CollaborationRequestDoesNotExistError } from "../../user/errors";
import canReadBlock from "../canReadBlock";
import {
  CollaborationRequestAcceptedAlreadyError,
  CollaborationRequestDeclinedAlreadyError
} from "../errors";
import { IRevokeCollaborationRequestsContext } from "./types";
import { revokeRequestJoiSchema } from "./validation";

async function revokeCollaborationRequests(
  context: IRevokeCollaborationRequestsContext
): Promise<void> {
  const data = validate(context.data, revokeRequestJoiSchema);

  // TODO: what if block does not exist?
  const block = await context.getBlockByID(data.customId);
  const user = await context.getUser();

  canReadBlock({ block, user });

  const request = await context.getNotificationByID(data.request);

  if (!request || request.from.blockId !== block.customId) {
    throw new CollaborationRequestDoesNotExistError();
  }

  const statusHistory = request.statusHistory;

  statusHistory.find(status => {
    if (status.status === "accepted") {
      throw new CollaborationRequestAcceptedAlreadyError();
    } else if (status.status === "declined") {
      throw new CollaborationRequestDeclinedAlreadyError();
    }
  });

  statusHistory.push({ status: "revoked", date: Date.now() });
  await context.updateNotificationByID(request.customId, { statusHistory });
}

export default revokeCollaborationRequests;
