import {IPermissionItem} from '../../../mongo/access-control/permissionItem';
import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {IPermissionItemQuery} from '../../contexts/data/permission/type';
import {getAssignPermissionPermQueries} from '../permissionQueries';
import {isFetchingOwnPermissions} from '../utils';
import {GetPermissionItemListEndpoint} from './types';
import {getPermissionItemListJoiSchema} from './validation';

const getPermissionItemList: GetPermissionItemListEndpoint = async (ctx, d) => {
  const data = validate(d.data, getPermissionItemListJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const fetchingOwnPermissions = isFetchingOwnPermissions(data.entity, user.customId);
  let permissionItem: IPermissionItem | null = null;

  if (!fetchingOwnPermissions) {
    const accessChecker = await getCheckAuthorizationChecker({
      ctx,
      user,
      orgId: data.organizationId,
      ...getAssignPermissionPermQueries(data.organizationId, data.container),
    });
  }

  const q: IPermissionItemQuery = {
    workspaceId: data.organizationId,
    action: data.action,
    allow: data.allow,
  };

  if (data.target) q.target = {$objMatch: data.target};
  if (data.entity) q.entity = {$objMatch: data.entity};

  const permissionList = await ctx.data.permissionItem.getManyByQuery(ctx, q);
  return {permissionList};
};

export default getPermissionItemList;
