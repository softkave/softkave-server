import {SystemActionType, SystemResourceType} from '../../../models/system';
import {getDate} from '../../../utilities/fns';
import {validate} from '../../../utilities/joiUtils';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {PermissionDeniedError} from '../../errors';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {assertUpdateRequest, getPublicCollaborationRequest} from '../utils';
import {MarkRequestReadEndpoint} from './types';
import {markRequestReadJoiSchema} from './validation';

const markRequestRead: MarkRequestReadEndpoint = async (ctx, d) => {
  const data = validate(d.data, markRequestReadJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const request = await ctx.collaborationRequest.assertGetCollaborationRequestById(
    ctx,
    data.requestId
  );

  if (request.to.email !== user.email) {
    throw new PermissionDeniedError();
  }

  const updatedRequest = await assertUpdateRequest(ctx, request.customId, {readAt: getDate()});
  const requestData = getPublicCollaborationRequest(updatedRequest);
  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getUserRoomName(user.customId), {
    actionType: SystemActionType.Update,
    resourceType: SystemResourceType.CollaborationRequest,
    resource: requestData,
  });

  return {request: requestData};
};

export default markRequestRead;
