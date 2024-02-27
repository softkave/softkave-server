import {SystemActionType, SystemResourceType} from '../../../models/system';
import {getDate} from '../../../utilities/fns';
import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {getAssignPermissionPermQueries} from '../../permissions/permissionQueries';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {getUpdateOrgPermQueries} from '../permissionQueries';
import {assertOrganization, getPublicOrganizationData} from '../utils';
import {UpdateOrganizationEndpoint} from './types';
import {updateBlockJoiSchema} from './validation';

const updateOrganization: UpdateOrganizationEndpoint = async (ctx, d) => {
  const data = validate(d.data, updateBlockJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);

  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: data.organizationId,
    ...getUpdateOrgPermQueries(data.organizationId),
  });

  if (data.data.visibility !== undefined) {
    const accessChecker = await getCheckAuthorizationChecker({
      ctx,
      user,
      orgId: data.organizationId,
      ...getAssignPermissionPermQueries(data.organizationId, {
        containerId: data.organizationId,
        containerType: SystemResourceType.Workspace,
      }),
    });
  }

  const org = await ctx.data.workspace.getAndUpdateOneByQuery(
    ctx,
    {customId: data.organizationId},
    {
      ...data.data,
      lastUpdatedAt: getDate(),
      lastUpdatedBy: user.customId,
    }
  );

  assertOrganization(org);
  const orgData = getPublicOrganizationData(org);
  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getOrganizationRoomName(org.customId), {
    actionType: SystemActionType.Update,
    resourceType: SystemResourceType.Workspace,
    resource: orgData,
  });

  return {organization: orgData};
};

export default updateOrganization;
