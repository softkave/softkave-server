import {SystemResourceType} from '../../../models/system';
import {IPermissionGroup} from '../../../mongo/access-control/permissionGroup';
import {getDate} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {validate} from '../../../utilities/joiUtils';
import {IBaseContext} from '../../contexts/IBaseContext';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {IPermissionGroupInput} from '../../contexts/data/permission/type';
import {getCreatePermissionGroupsPermQueries} from '../permissionQueries';
import {assertPermissionGroupWithNameDoesNotExist, getPublicPermissionGroupData} from '../utils';
import {CreatePermissionGroupEndpoint} from './types';
import {createPermissionGroupJoiSchema} from './validation';

const createPermissionGroup: CreatePermissionGroupEndpoint = async (ctx, d) => {
  const data = validate(d.data, createPermissionGroupJoiSchema);
  const user = await ctx.session.getUser(ctx, d);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: data.organizationId,
    ...getCreatePermissionGroupsPermQueries(data.organizationId, data.permissionGroup.container),
  });

  // TODO: check that containers exist and that user can read them

  const pg = await INTERNAL_createPermissionGroup(
    ctx,
    user.customId,
    data.organizationId,
    data.permissionGroup
  );
  return {permissionGroup: getPublicPermissionGroupData(pg)};
};

export async function INTERNAL_createPermissionGroup(
  ctx: IBaseContext,
  userId: string,
  organizationId: string,
  permissionGroup: IPermissionGroupInput,
  other: Partial<IPermissionGroup> = {}
) {
  await assertPermissionGroupWithNameDoesNotExist(
    ctx,
    permissionGroup.container,
    permissionGroup.name
  );
  const pg: IPermissionGroup = {
    ...permissionGroup,
    workspaceId: organizationId,
    customId: getNewId02(SystemResourceType.PermissionGroup),
    createdAt: getDate(),
    createdBy: userId,
    visibility: 'organization',
    ...other,
  };
  await ctx.data.permissionGroup.insertList(ctx, [pg]);
  return pg;
}

export default createPermissionGroup;
