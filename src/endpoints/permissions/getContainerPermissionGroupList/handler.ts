import {validate} from '../../../utilities/joiUtils';
import {endpointConstants} from '../../constants';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {IPermissionGroupQuery} from '../../contexts/data/permission/type';
import {getReadPermissionGroupsPermQueries} from '../permissionQueries';
import {getPublicPermissionGroupsArray} from '../utils';
import {GetContainerPermissionGroupListEndpoint} from './types';
import {getContainerPermissionGroupListJoiSchema} from './validation';

const getContainerPermissionGroupList: GetContainerPermissionGroupListEndpoint = async (ctx, d) => {
  const data = validate(d.data, getContainerPermissionGroupListJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: data.workspaceId,
    ...getReadPermissionGroupsPermQueries(data.workspaceId, data.container),
  });

  const q: IPermissionGroupQuery = {
    container: {$objMatch: data.container},
  };
  const page = data.page ?? endpointConstants.startPage;
  const pageSize = data.pageSize ?? endpointConstants.maxPageSize;
  const [pgList, count] = await Promise.all([
    ctx.data.permissionGroup.getManyByQuery(ctx, q, {
      page,
      pageSize,
    }),
    ctx.data.permissionGroup.countByQuery(ctx, q),
  ]);

  return {count, page, pageSize, permissionGroups: getPublicPermissionGroupsArray(pgList)};
};

export default getContainerPermissionGroupList;
