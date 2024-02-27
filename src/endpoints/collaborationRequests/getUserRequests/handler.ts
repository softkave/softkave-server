import {getPublicCollaborationRequestArray} from '../utils';
import {GetUserRequestsEndpoint} from './types';

const getUserRequests: GetUserRequestsEndpoint = async (ctx, d) => {
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const requests = await ctx.collaborationRequest.getUserCollaborationRequests(ctx, user.email);
  return {requests: getPublicCollaborationRequestArray(requests)};
};

export default getUserRequests;
