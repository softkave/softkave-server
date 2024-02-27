import {IResourceWithDescriptor} from '../../../models/resource';
import {SystemResourceType} from '../../../models/system';
import {EavAttributes, IEavAssignedPermissionGroup} from '../../../mongo/eav/eav';
import {cast} from '../../../utilities/fns';
import {validate} from '../../../utilities/joiUtils';
import {getCollaboratorDataFromUser} from '../../collaborators/utils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {IEavAssignedPermissionGroupQuery} from '../../contexts/data/eav/type';
import {getAssignPermissionPermQueries} from '../permissionQueries';
import {assertPermissionGroup} from '../utils';
import {GetPermissionGroupAssigneesEndpoint} from './types';
import {getPermissionGroupAssigneesJoiSchema} from './validation';

export const getPermissionGroupAssigneesEndpoint: GetPermissionGroupAssigneesEndpoint = async (
  ctx,
  d
) => {
  const data = validate(d.data, getPermissionGroupAssigneesJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const pg = await ctx.data.permissionGroup.getOneByQuery(ctx, {customId: data.permissionGroupId});
  assertPermissionGroup(pg);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: data.organizationId,
    actionTarget: pg,
    ...getAssignPermissionPermQueries(data.organizationId, pg.container),
  });

  const eavAssignedPgQuery: IEavAssignedPermissionGroupQuery = {
    workspaceId: data.organizationId,
    attribute: EavAttributes.AssignedPermissionGroup,
    value: {
      $objMatch: {
        permissionGroupId: data.permissionGroupId,
      },
    },
  };

  // TODO: set page size and or perform in batches.
  const eavMatch = await ctx.data.eav.getManyByQuery<IEavAssignedPermissionGroup>(
    ctx,
    eavAssignedPgQuery
  );

  const userIds: string[] = [];
  const anonymousUserIds: string[] = [];
  const pgIds: string[] = [];
  eavMatch.forEach(item => {
    if (item.entityType === SystemResourceType.User) userIds.push(item.entityId);
    else if (item.entityType === SystemResourceType.AnonymousUser)
      anonymousUserIds.push(item.entityId);
    else if (item.entityType === SystemResourceType.PermissionGroup) pgIds.push(item.entityId);
  });

  const [users, anonymousUsers, pgList] = await Promise.all([
    ctx.data.user.getManyByQuery(ctx, {customId: {$in: userIds}}),
    ctx.data.anonymousUser.getManyByQuery(ctx, {customId: {$in: anonymousUserIds}}),
    ctx.data.permissionGroup.getManyByQuery(ctx, {customId: {$in: pgIds}}),
  ]);

  const resources = cast<Array<IResourceWithDescriptor<any>>>([])
    .concat(
      users.map(item => ({
        customId: item.customId,
        type: SystemResourceType.User,
        data: getCollaboratorDataFromUser(item),
      }))
    )
    .concat(
      anonymousUsers.map(item => ({
        customId: item.customId,
        type: SystemResourceType.AnonymousUser,
        data: getCollaboratorDataFromUser(item),
      }))
    )
    .concat(
      pgList.map(item => ({
        customId: item.customId,
        type: SystemResourceType.PermissionGroup,
        data: item,
      }))
    );

  return {resources};
};
