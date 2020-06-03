import { CollaborationRequestStatusType } from "../../../mongo/notification";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { PermissionDeniedError } from "../../errors";
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
    data.customId
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
    data.customId,
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
    context.notification.deleteNotificationById(context.models, data.customId);
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
};

export default respondToCollaborationRequest;
