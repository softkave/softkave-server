import { CollaborationRequestStatusType } from "../../../mongo/notification";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { PermissionDeniedError } from "../../errors";
import {
  IOrgCollaborationRequestResponsePacket,
  IUserCollaborationRequestResponsePacket,
  OutgoingSocketEvents,
} from "../../socket/server";
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
  const user = await context.session.getUser(context, instData);
  const req = await context.notification.getNotificationById(
    context,
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
  const userAccepted =
    data.response === CollaborationRequestStatusType.Accepted;
  statusHistory.push({
    status: userAccepted
      ? CollaborationRequestStatusType.Accepted
      : CollaborationRequestStatusType.Declined,
    date: getDate(),
  });

  await context.notification.updateNotificationById(context, data.requestId, {
    statusHistory,
  });

  const ownerBlock = await context.block.getBlockById(
    context,
    req.from.blockId
  );

  if (!ownerBlock) {
    // if the org does not exist or has been deleted
    // TODO: should we log something here?
    // TODO: figure our log points, i.e, what are the things we should be logging?
    // TODO: what should we do if the org does not exist?
    // context.notification.deleteNotificationById(context, data.requestId);
  } else if (userAccepted) {
    if (!userIsPartOfOrg(user, ownerBlock.customId)) {
      const userOrgs = user.orgs.concat({ customId: ownerBlock.customId });
      await context.session.updateUser(context, instData, {
        orgs: userOrgs,
      });
      return { block: ownerBlock };
    } else {
      // TODO: should we log an error because it means the user already has the org
    }
  }

  const orgsBroadcastData: IOrgCollaborationRequestResponsePacket = {
    customId: req.customId,
    response: data.response,
  };

  const blockRoomName = context.room.getBlockRoomName(ownerBlock);
  context.room.broadcast(
    context,
    blockRoomName,
    OutgoingSocketEvents.OrgCollaborationRequestResponse,
    orgsBroadcastData,
    instData
  );

  const userClientsBroadcastData: IUserCollaborationRequestResponsePacket = {
    customId: req.customId,
    response: data.response,
    org: userAccepted ? ownerBlock : undefined,
  };

  const userRoomName = context.room.getUserPersonalRoomName(user);
  context.room.broadcast(
    context,
    userRoomName,
    OutgoingSocketEvents.UserCollaborationRequestResponse,
    userClientsBroadcastData,
    instData
  );
};

export default respondToCollaborationRequest;
