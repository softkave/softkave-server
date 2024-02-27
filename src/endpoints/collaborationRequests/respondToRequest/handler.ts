import {SystemActionType, SystemResourceType} from '../../../models/system';
import {CollaborationRequestStatusType} from '../../../mongo/collaboration-request/definitions';
import {getDate, getDateString} from '../../../utilities/fns';
import {validate} from '../../../utilities/joiUtils';
import {getCollaboratorDataFromUser} from '../../collaborators/utils';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {PermissionDeniedError} from '../../errors';
import {assertOrganization, getPublicOrganizationData} from '../../organizations/utils';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {
  CollaborationRequestAcceptedError,
  CollaborationRequestDeclinedError,
  CollaborationRequestRevokedError,
} from '../../user/errors';
import {assertUser, userIsPartOfOrganization} from '../../user/utils';
import {getPublicCollaborationRequest} from '../utils';
import {RespondToCollaborationRequestEndpoint} from './types';
import {respondToCollaborationRequestJoiSchema} from './validation';

const respondToRequest: RespondToCollaborationRequestEndpoint = async (ctx, d) => {
  const data = validate(d.data, respondToCollaborationRequestJoiSchema);
  let user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const request = await ctx.collaborationRequest.assertGetCollaborationRequestById(
    ctx,
    data.requestId
  );

  if (request.to.email !== user.email) {
    throw new PermissionDeniedError();
  }

  if (request.statusHistory) {
    const currentStatus = request.statusHistory[request.statusHistory.length - 1];
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
  const userAccepted = data.response === CollaborationRequestStatusType.Accepted;
  const respondedAt = getDate();
  const respondedAtStr = getDateString(respondedAt);
  statusHistory.push({
    status: userAccepted
      ? CollaborationRequestStatusType.Accepted
      : CollaborationRequestStatusType.Declined,
    date: respondedAt,
  });

  await ctx.collaborationRequest.updateCollaborationRequestById(ctx, data.requestId, {
    statusHistory,
  });

  const organization = await ctx.data.workspace.getOneByQuery(ctx, {
    workspaceId: request.workspaceId,
  });
  assertOrganization(organization);

  const publicOrganization = getPublicOrganizationData(organization);
  const requestData = getPublicCollaborationRequest(request);
  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getUserRoomName(user.customId), {
    actionType: SystemActionType.Update,
    resourceType: SystemResourceType.CollaborationRequest,
    resource: requestData,
  });

  outgoingSocketEventFn(
    ctx,
    SocketRoomNameHelpers.getOrganizationRoomName(request.from.workspaceId),
    {
      actionType: SystemActionType.Update,
      resourceType: SystemResourceType.CollaborationRequest,
      resource: requestData,
    }
  );

  if (userAccepted) {
    if (!userIsPartOfOrganization(user, organization.customId)) {
      const userOrganizations = user.workspaces.concat({
        customId: organization.customId,
      });
      const updatedUser = await ctx.user.updateUserById(ctx, user.customId, {
        workspaces: userOrganizations,
      });
      assertUser(updatedUser);
      user = updatedUser;
      d.user = user;
    }

    outgoingSocketEventFn(
      ctx,
      SocketRoomNameHelpers.getOrganizationRoomName(request.from.workspaceId),
      {
        actionType: SystemActionType.Create,
        resourceType: SystemResourceType.User,
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
