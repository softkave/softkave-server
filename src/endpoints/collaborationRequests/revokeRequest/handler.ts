import {SystemActionType, SystemResourceType} from '../../../models/system';
import {IWorkspace} from '../../../mongo/block/workspace';
import {
  CollaborationRequestEmailReason,
  CollaborationRequestStatusType,
  ICollaborationRequest,
} from '../../../mongo/collaboration-request/definitions';
import {getDate} from '../../../utilities/fns';
import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {assertOrganization} from '../../organizations/utils';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {
  CollaborationRequestAcceptedError,
  CollaborationRequestDeclinedError,
  CollaborationRequestDoesNotExistError,
} from '../../user/errors';
import {fireAndForgetPromise} from '../../utils';
import {getRevokeRequestPermQueries} from '../permissionQueries';
import {assertRequest, getPublicCollaborationRequest} from '../utils';
import {IRevokeCollaborationRequestContext, RevokeCollaborationRequestsEndpoint} from './types';
import {revokeRequestJoiSchema} from './validation';

const revokeRequest: RevokeCollaborationRequestsEndpoint = async (ctx, d) => {
  const data = validate(d.data, revokeRequestJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const organization = await ctx.data.workspace.getOneByQuery(ctx, {
    workspaceId: data.organizationId,
  });
  assertOrganization(organization);
  const request = await ctx.collaborationRequest.assertGetCollaborationRequestById(
    ctx,
    data.requestId
  );

  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: organization.customId,
    actionTarget: request,
    ...getRevokeRequestPermQueries(organization.customId, request.customId),
  });

  if (request.from.workspaceId !== organization.customId) {
    throw new CollaborationRequestDoesNotExistError();
  }

  const statusHistory = request.statusHistory;
  statusHistory.find(status => {
    if (status.status === CollaborationRequestStatusType.Accepted) {
      throw new CollaborationRequestAcceptedError();
    } else if (status.status === CollaborationRequestStatusType.Declined) {
      throw new CollaborationRequestDeclinedError();
    }
  });

  statusHistory.push({status: CollaborationRequestStatusType.Revoked, date: new Date()});
  const savedRequest = await ctx.collaborationRequest.updateCollaborationRequestById(
    ctx,
    request.customId,
    {statusHistory}
  );

  assertRequest(savedRequest);
  const requestData = getPublicCollaborationRequest(savedRequest);
  const recipient = await ctx.user.getUserByEmail(ctx, savedRequest.to.email);
  if (recipient) {
    outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getUserRoomName(recipient.customId), {
      actionType: SystemActionType.Update,
      resourceType: SystemResourceType.CollaborationRequest,
      resource: requestData,
    });
  }

  outgoingSocketEventFn(
    ctx,
    SocketRoomNameHelpers.getOrganizationRoomName(savedRequest.from.workspaceId),
    {
      actionType: SystemActionType.Update,
      resourceType: SystemResourceType.CollaborationRequest,
      resource: requestData,
    }
  );

  fireAndForgetPromise(notifyRecipient(ctx, organization, savedRequest));

  return {request: requestData};
};

async function notifyRecipient(
  context: IRevokeCollaborationRequestContext,
  organization: IWorkspace,
  request: ICollaborationRequest
) {
  await context.sendCollaborationRequestRevokedEmail(context, {
    email: request.to.email,
    workspaceName: organization.name,
    loginLink: context.appVariables.loginPath,
    signupLink: context.appVariables.signupPath,
  });

  context.collaborationRequest.updateCollaborationRequestById(context, request.customId, {
    sentEmailHistory: request.sentEmailHistory.concat({
      date: getDate(),
      reason: CollaborationRequestEmailReason.RequestRevoked,
    }),
  });
}

export default revokeRequest;
