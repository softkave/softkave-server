import {ResourceVisibilityMap} from '../../../models/resource';
import {SystemActionType, SystemResourceType} from '../../../models/system';
import {IWorkspace} from '../../../mongo/block/workspace';
import {getDate} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {validate} from '../../../utilities/joiUtils';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {setupOrgPermissionGroups} from '../../permissions/utils';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {assertUser} from '../../user/utils';
import {OrganizationExistsError} from '../errors';
import {getPublicOrganizationData} from '../utils';
import {CreateOrganizationEndpoint} from './types';
import {createOrganizationJoiSchema} from './validation';

const createOrganization: CreateOrganizationEndpoint = async (ctx, d) => {
  const data = validate(d.data, createOrganizationJoiSchema);
  const user = await ctx.session.getUser(ctx, d);
  const organizationExists = await ctx.data.workspace.existsByQuery(ctx, {
    name: {$regex: new RegExp(`^${data.organization.name}$`, 'i')},
  });

  if (organizationExists) {
    throw new OrganizationExistsError({field: 'name'});
  }

  const orgId = getNewId02(SystemResourceType.Workspace);
  const organization: IWorkspace = {
    customId: orgId,
    workspaceId: orgId,
    createdBy: user.customId,
    createdAt: getDate(),
    name: data.organization.name,
    description: data.organization.description,
    color: data.organization.color,
    visibility: data.organization.visibility ?? ResourceVisibilityMap.Workspace,
  };

  await ctx.data.workspace.insertList(ctx, [organization]);
  await setupOrgPermissionGroups(ctx, user.customId, orgId);

  // TODO: scrub for organizations that are not added to user and add or clean them
  //    you can do this when user tries to read them, or add them again
  // TODO: scrub all data that failed it's pipeline

  const userOrganizations = user.workspaces.concat({customId: organization.customId});
  const updatedUser = await ctx.user.updateUserById(ctx, user.customId, {
    workspaces: userOrganizations,
  });
  assertUser(updatedUser);
  d.user = updatedUser;
  const orgData = getPublicOrganizationData(organization);
  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getUserRoomName(updatedUser.customId), {
    actionType: SystemActionType.Create,
    resourceType: SystemResourceType.Workspace,
    resource: orgData,
  });

  return {organization: orgData};
};

export default createOrganization;
