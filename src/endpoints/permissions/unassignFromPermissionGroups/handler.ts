import {EavAttributes} from '../../../mongo/eav/eav';
import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {IEavAssignedPermissionGroupQuery} from '../../contexts/data/eav/type';
import {getAssignPermissionPermQueries} from '../permissionQueries';
import {UnassignPermissionGroupsEndpoint} from './types';
import {unassignPermissionGroupsJoiSchema} from './validation';

// TODO
export const unassignPermissionGroupsEndpoint: UnassignPermissionGroupsEndpoint = async (
  ctx,
  d
) => {
  const data = validate(d.data, unassignPermissionGroupsJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);

  const pgIdList = data.items.map(item => item.permissionGroupId);
  const pgList = await ctx.data.permissionGroup.getManyByQuery(ctx, {customId: {$in: pgIdList}});
  const accessCheckers = await Promise.all(
    pgList.map(pg =>
      getCheckAuthorizationChecker({
        ctx,
        user,
        orgId: data.organizationId,
        ...getAssignPermissionPermQueries(data.organizationId, pg.container),
      })
    )
  );

  const queries: IEavAssignedPermissionGroupQuery[] = [];
  data.items.forEach(item => {
    const q: IEavAssignedPermissionGroupQuery = {
      workspaceId: data.organizationId,
      attribute: EavAttributes.AssignedPermissionGroup,
      value: {
        $objMatch: {
          permissionGroupId: item.permissionGroupId,
          entityId: item.entity.entityId,
          entityType: item.entity.entityType,
        },
      },
    };

    queries.push(q);
  });

  await ctx.data.eav.deleteManyByQueries(ctx, queries);
};
