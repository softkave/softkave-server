import { SystemActionType, SystemResourceType } from '../../../models/system';
import {
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from '../../../mongo/collaboration-request/definitions';
import { getDate } from '../../../utilities/fns';
import { getNewId02 } from '../../../utilities/ids';
import { validate } from '../../../utilities/joiUtils';
import { getCheckAuthorizationChecker } from '../../contexts/authorization-checks/checkAuthorizaton';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import { assertOrganization } from '../../organizations/utils';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import { fireAndForgetPromise } from '../../utils';
import { getCreateRequestPermQueries } from '../permissionQueries';
import { getPublicCollaborationRequestArray } from '../utils';
import filterNewCollaborators from './filterNewCollaborators';
import sendEmails from './sendEmails';
import { AddCollaboratorEndpoint } from './types';
import { addCollaboratorsJoiSchema } from './validation';

const addCollaborators: AddCollaboratorEndpoint = async (ctx, d) => {
  const data = validate(d.data, addCollaboratorsJoiSchema);
  const collaborators = data.collaborators;
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const organization = await ctx.data.workspace.getOneByQuery(ctx, {customId: data.organizationId});
  assertOrganization(organization);

  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: organization.customId,
    ...getCreateRequestPermQueries(organization.customId),
  });

  const {indexedExistingUsers} = await filterNewCollaborators(ctx, {
    organization,
    collaborators,
  });

  const now = getDate();
  const collaborationRequests = collaborators.map(request => {
    const newRequest: ICollaborationRequest = {
      customId: getNewId02(SystemResourceType.CollaborationRequest),
      from: {
        userId: user.customId,
        userName: user.firstName,
        workspaceId: organization.customId,
        workspaceName: organization.name,
      },
      createdBy: user.customId,
      createdAt: now,
      title: `Collaboration request from ${organization.name}`,
      to: {email: request.email},
      statusHistory: [{status: CollaborationRequestStatusType.Pending, date: now}],
      sentEmailHistory: [],
      body: `You have a new collaboration request from ${user.firstName} of ${organization.name}`,
      visibility: 'organization',
      workspaceId: organization.customId,
    };

    return newRequest;
  });

  await ctx.collaborationRequest.bulkSaveCollaborationRequests(ctx, collaborationRequests);

  // TODO: maybe deffer sending email till end of day
  fireAndForgetPromise(
    sendEmails(ctx, {user, indexedExistingUsers, requests: collaborationRequests})
  );

  const requestListData = getPublicCollaborationRequestArray(collaborationRequests);
  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getOrganizationRoomName(organization.customId), {
    actionType: SystemActionType.Create,
    resourceType: SystemResourceType.CollaborationRequest,
    resource: requestListData,
  });

  requestListData.forEach(request => {
    const existingUser = indexedExistingUsers[request.to.email.toLowerCase()];
    if (existingUser) {
      outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getUserRoomName(existingUser.customId), {
        actionType: SystemActionType.Create,
        resourceType: SystemResourceType.CollaborationRequest,
        resource: request,
      });
    }
  });

  return {requests: requestListData};
};

export default addCollaborators;
