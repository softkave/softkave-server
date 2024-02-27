import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getDeletePermissionGroupPermQueries} from '../permissionQueries';
import {DeletePermissionGroupsEndpoint} from './types';
import {deletePermissionGroupsJoiSchema} from './validation';

const deletePermissionGroups: DeletePermissionGroupsEndpoint = async (ctx, d) => {
  const data = validate(d.data, deletePermissionGroupsJoiSchema);
  const user = await ctx.session.getUser(ctx, d);
  const pgList = await ctx.data.permissionGroup.getManyByQuery(ctx, {
    customId: {$in: data.permissionGroupIds},
  });
  const accessCheckers = await Promise.all(
    pgList
      .filter(pg => !pg.isSystemManaged)
      .map(pg =>
        getCheckAuthorizationChecker({
          ctx,
          user,
          orgId: data.workspaceId,
          actionTarget: pg,
          ...getDeletePermissionGroupPermQueries(data.workspaceId, pg.container, pg.customId),
        })
      )
  );

  // TODO: auth check
  await ctx.data.permissionGroup.deleteManyByQuery(ctx, {customId: {$in: data.permissionGroupIds}});
};

export default deletePermissionGroups;
