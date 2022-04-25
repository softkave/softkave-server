import { CollaborationRequestStatusType } from "../../../mongo/collaboration-request";
import { getDate, getDateString } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { PermissionDeniedError } from "../../errors";
import {
  CollaborationRequestAcceptedError,
  CollaborationRequestDeclinedError,
  CollaborationRequestRevokedError,
} from "../../user/errors";
import { userIsPartOfOrganization } from "../../user/utils";
import { RespondToCollaborationRequestEndpoint } from "./types";
import { respondToCollaborationRequestJoiSchema } from "./validation";
import { IOrganization } from "../../organization/types";
import {
  getPublicOrganizationData,
  throwOrganizationNotFoundError,
} from "../../organization/utils";
import { getPublicCollaborationRequest } from "../utils";
import outgoingEventFn from "../../socket/outgoingEventFn";
import SocketRoomNameHelpers from "../../contexts/SocketRoomNameHelpers";
import { SystemActionType, SystemResourceType } from "../../../models/system";
import { getCollaboratorDataFromUser } from "../../collaborator/utils";

const respondToRequest: RespondToCollaborationRequestEndpoint = async (
  context,
  instData
) => {
  const data = validate(instData.data, respondToCollaborationRequestJoiSchema);
  let user = await context.session.getUser(context, instData);
  const request =
    await context.collaborationRequest.assertGetCollaborationRequestById(
      context,
      data.requestId
    );

  if (request.to.email !== user.email) {
    throw new PermissionDeniedError();
  }

  if (request.statusHistory) {
    const currentStatus =
      request.statusHistory[request.statusHistory.length - 1];

    switch (currentStatus.status) {
      case CollaborationRequestStatusType.Accepted:
        throw new CollaborationRequestAcceptedError();

      case CollaborationRequestStatusType.Declined:
        throw new CollaborationRequestDeclinedError();

      case CollaborationRequestStatusType.Revoked:
        throw new CollaborationRequestRevokedError();
    }
  }

  const statusHistory = request.statusHistory || [];
  const userAccepted =
    data.response === CollaborationRequestStatusType.Accepted;
  const respondedAt = getDate();
  const respondedAtStr = getDateString(respondedAt);
  statusHistory.push({
    status: userAccepted
      ? CollaborationRequestStatusType.Accepted
      : CollaborationRequestStatusType.Declined,
    date: respondedAt,
  });

  await context.collaborationRequest.updateCollaborationRequestById(
    context,
    data.requestId,
    {
      statusHistory,
    }
  );

  const organization = await context.block.assertGetBlockById<IOrganization>(
    context,
    request.from.blockId,
    throwOrganizationNotFoundError
  );

  const publicOrganization = getPublicOrganizationData(organization);
  const requestData = getPublicCollaborationRequest(request);
  outgoingEventFn(
    context,
    SocketRoomNameHelpers.getUserRoomName(user.customId),
    {
      actionType: SystemActionType.Update,
      resourceType: SystemResourceType.CollaborationRequest,
      resource: requestData,
    }
  );

  outgoingEventFn(
    context,
    SocketRoomNameHelpers.getOrganizationRoomName(request.from.blockId),
    {
      actionType: SystemActionType.Update,
      resourceType: SystemResourceType.CollaborationRequest,
      resource: requestData,
    }
  );

  if (userAccepted) {
    if (!userIsPartOfOrganization(user, organization.customId)) {
      const userOrganizations = user.orgs.concat({
        customId: organization.customId,
      });

      user = await context.user.updateUserById(context, user.customId, {
        orgs: userOrganizations,
      });
    }

    outgoingEventFn(
      context,
      SocketRoomNameHelpers.getOrganizationRoomName(request.from.blockId),
      {
        actionType: SystemActionType.Create,
        resourceType: SystemResourceType.Collaborator,
        resource: getCollaboratorDataFromUser(user),
      }
    );
  }

  return {
    respondedAt: respondedAtStr,
    organization: userAccepted ? publicOrganization : undefined,
    request: requestData,
  };
};

export default respondToRequest;
