import {
  CollaborationRequestStatusType,
  INotification,
} from "../../../mongo/notification";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { PermissionDeniedError } from "../../errors";
import { OutgoingSocketEvents } from "../../socket/server";
import {
  CollaborationRequestAcceptedError,
  CollaborationRequestDeclinedError,
  CollaborationRequestDoesNotExistError,
  CollaborationRequestHasExpiredError,
  CollaborationRequestRevokedError,
} from "../errors";
import { userIsPartOfOrg } from "../utils";
import { RespondToCollaborationRequestEndpoint } from "./types";
import { respondToCollaborationRequestJoiSchema } from "./validation";

const respondToCollaborationRequest: RespondToCollaborationRequestEndpoint = async (
  context,
  instData
) => {
  const data = validate(instData.data, respondToCollaborationRequestJoiSchema);
  const user = await context.session.getUser(context.models, instData);
  const req = await context.notification.getNotificationById(
    context.models,
    data.requestId
  );

  if (!!!req) {
    throw new CollaborationRequestDoesNotExistError();
  }

  if (req.to.email !== user.email) {
    throw new PermissionDeniedError();
  }

  if (req.statusHistory) {
    const currentStatus = req.statusHistory[req.statusHistory.length - 1];

    switch (currentStatus.status) {
      case CollaborationRequestStatusType.Accepted:
        throw new CollaborationRequestAcceptedError();

      case CollaborationRequestStatusType.Declined:
        throw new CollaborationRequestDeclinedError();

      case CollaborationRequestStatusType.Revoked:
        throw new CollaborationRequestRevokedError();
    }
  }

  if (req.expiresAt && new Date(req.expiresAt) < new Date()) {
    throw new CollaborationRequestHasExpiredError();
  }

  const statusHistory = req.statusHistory || [];
  statusHistory.push({
    status:
      data.response === "accepted"
        ? CollaborationRequestStatusType.Accepted
        : CollaborationRequestStatusType.Declined,
    date: getDate(),
  });

  await context.notification.updateNotificationById(
    context.models,
    data.requestId,
    { statusHistory }
  );

  const ownerBlock = await context.block.getBlockById(
    context.models,
    req.from.blockId
  );

  if (!ownerBlock) {
    // if the org does not exist or has been deleted
    // TODO: should we log something here?
    // TODO: figure our log points, i.e, what are the things we should be logging?
    // TODO: what should we do if the org does not exist?
    // context.notification.deleteNotificationById(context.models, data.requestId);
  } else if (data.response === CollaborationRequestStatusType.Accepted) {
    if (!userIsPartOfOrg(user, ownerBlock.customId)) {
      const userOrgs = user.orgs.concat({ customId: ownerBlock.customId });
      await context.session.updateUser(context.models, instData, {
        orgs: userOrgs,
      });
      return { block: ownerBlock };
    } else {
      // TODO: should we log an error because it means the user already has the org
    }
  }

  context.room.broadcastInBlock(
    context.socketServer,
    ownerBlock,
    OutgoingSocketEvents.OrgCollaborationRequestResponse,
    {
      customId: req.customId,
      response: data.response,
    }
  );

  context.room.broadcastToUserClients(
    context.socketServer,
    user.customId,
    OutgoingSocketEvents.UserCollaborationRequestResponse,
    {
      customId: req.customId,
      response: data.response,
      org: ownerBlock,
    },
    instData.socket
  );
};

export default respondToCollaborationRequest;
