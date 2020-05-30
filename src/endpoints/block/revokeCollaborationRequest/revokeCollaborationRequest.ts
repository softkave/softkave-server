import { CollaborationRequestStatusType } from "../../../mongo/notification";
import { validate } from "../../../utilities/joiUtils";
import {
  CollaborationRequestAcceptedError,
  CollaborationRequestDeclinedError,
  CollaborationRequestDoesNotExistError,
} from "../../user/errors";
import canReadBlock from "../canReadBlock";
import { RevokeCollaborationRequestsEndpoint } from "./types";
import { revokeRequestJoiSchema } from "./validation";

const revokeCollaborationRequest: RevokeCollaborationRequestsEndpoint = async (
  context,
  instData
) => {
  const data = validate(instData.data, revokeRequestJoiSchema);

  // TODO: what if block does not exist?
  const block = await context.block.getBlockById(context.models, data.blockId);
  const user = await context.session.getUser(context.models, instData);

  canReadBlock({ block, user });

  const request = await context.notification.getNotificationById(
    context.models,
    data.requestId
  );

  if (!request || request.collaborationRequestFrom.blockId !== block.customId) {
    throw new CollaborationRequestDoesNotExistError();
  }

  const statusHistory = request.statusHistory;

  statusHistory.find((status) => {
    if (status.status === CollaborationRequestStatusType.Accepted) {
      throw new CollaborationRequestAcceptedError();
    } else if (status.status === CollaborationRequestStatusType.Declined) {
      throw new CollaborationRequestDeclinedError();
    }
  });

  statusHistory.push({
    status: CollaborationRequestStatusType.Revoked,
    date: new Date().toString(),
  });
  await context.notification.updateNotificationById(
    context.models,
    request.customId,
    { statusHistory }
  );
};

export default revokeCollaborationRequest;
