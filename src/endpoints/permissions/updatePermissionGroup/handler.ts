import {getDate} from '../../../utilities/fns';
import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getUpdatePermissionGroupPermQueries} from '../permissionQueries';
import {
  assertPermissionGroup,
  assertPermissionGroupWithNameDoesNotExist,
  getPublicPermissionGroupData,
} from '../utils';
import {UpdatePermissionGroupEndpoint} from './types';
import {updatePermissionGroupJoiSchema} from './validation';

const updatePermissionGroup: UpdatePermissionGroupEndpoint = async (ctx, d) => {
  const data = validate(d.data, updatePermissionGroupJoiSchema);
  const user = await ctx.session.getUser(ctx, d);

  const pg = await ctx.data.permissionGroup.getOneByQuery(ctx, {customId: data.permissionGroupId});
  assertPermissionGroup(pg);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: pg.workspaceId,
    ...getUpdatePermissionGroupPermQueries(pg.workspaceId, pg.container, pg.customId),
  });

  // TODO: auth check
  // TODO: check that containers exist and that user can read them
  await assertPermissionGroupWithNameDoesNotExist(
    ctx,
    data.permissionGroup.container,
    data.permissionGroup.name
  );
  const updatedPg = await ctx.data.permissionGroup.getAndUpdateOneByQuery(
    ctx,
    {customId: data.permissionGroupId},
    {...data.permissionGroup, lastUpdatedAt: getDate(), lastUpdatedBy: user.customId}
  );
  assertPermissionGroup(updatedPg);

  return {permissionGroup: getPublicPermissionGroupData(updatedPg)};
};

export default updatePermissionGroup;
