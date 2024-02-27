import {SystemActionType, SystemResourceType} from '../../../models/system';
import {validate} from '../../../utilities/joiUtils';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {assertOrganization} from '../../organizations/utils';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {UserDoesNotExistError} from '../../user/errors';
import {getRemoveCollaboratorPermQueries} from '../permissionQueries';
import {getCollaboratorDataFromUser} from '../utils';
import {RemoveCollaboratorEndpoint} from './types';
import {removeCollaboratorJoiSchema} from './validation';

const removeCollaborator: RemoveCollaboratorEndpoint = async (ctx, d) => {
  const data = validate(d.data, removeCollaboratorJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const organization = await ctx.data.workspace.getOneByQuery(ctx, {
    workspaceId: data.organizationId,
  });
  assertOrganization(organization);

  const collaborator = await ctx.user.getUserById(ctx, data.collaboratorId);
  if (!collaborator) {
    throw new UserDoesNotExistError();
  }

  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: organization.customId,
    actionTarget: getCollaboratorDataFromUser(collaborator),
    ...getRemoveCollaboratorPermQueries(organization.customId, collaborator.customId),
  });

  const collaboratorOrganizations = [...collaborator.workspaces];
  const index = collaboratorOrganizations.findIndex(org => org.customId === org.customId);
  if (index === -1) {
    return;
  }

  collaboratorOrganizations.splice(index, 1);
  await ctx.user.updateUserById(ctx, collaborator.customId, {
    workspaces: collaboratorOrganizations,
  });

  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getUserRoomName(collaborator.customId), {
    actionType: SystemActionType.Delete,
    resourceType: SystemResourceType.Workspace,
    resource: {customId: organization.customId},
  });

  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getOrganizationRoomName(organization.customId), {
    actionType: SystemActionType.Delete,
    resourceType: SystemResourceType.User,
    resource: {customId: collaborator.customId},
  });
};

export default removeCollaborator;
