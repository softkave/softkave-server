import {uniqBy} from 'lodash';
import {SystemResourceType} from '../../../models/system';
import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {IPermissionItemQuery} from '../../contexts/data/permission/type';
import {ResourceWithIdQuery, fetchResourceList} from '../../utils';
import {getAssignPermissionPermQueries} from '../permissionQueries';
import {DeletePermissionItemsEndpoint} from './types';
import {deletePermissionItemsJoiSchema} from './validation';
import assert = require('assert');

const deletePermissionItems: DeletePermissionItemsEndpoint = async (ctx, d) => {
  const data = validate(d.data, deletePermissionItemsJoiSchema);
  const user = await ctx.session.getUser(ctx, d);

  let rQueries: ResourceWithIdQuery[] = [];
  data.items.forEach(item => {
    if (item.target) rQueries.push({id: item.target.targetId, type: item.target.targetType});
    if (item.target) rQueries.push({id: item.target.containerId, type: item.target.containerType});
    if (item.entity) rQueries.push({id: item.entity.entityId, type: item.entity.entityType});
  });
  rQueries = uniqBy(rQueries, 'id');
  const resourceList = await fetchResourceList(ctx, rQueries);

  const containers = resourceList
    .filter(r => r?.type === SystemResourceType.Workspace || r?.type === SystemResourceType.Board)
    .map(c => {
      assert(c);
      return c;
    });
  const accessCheckers = await Promise.all(
    containers.map(c =>
      getCheckAuthorizationChecker({
        ctx,
        user,
        orgId: data.organizationId,
        actionTarget: c.data,
        ...getAssignPermissionPermQueries(data.organizationId, {
          containerId: c.customId,
          containerType: c.type,
        }),
      })
    )
  );

  const queries: IPermissionItemQuery[] = [];
  data.items.forEach(item => {
    if (!item.target && !item.entity) return;

    const q: IPermissionItemQuery = {
      workspaceId: data.organizationId,
      action: item.action,
      allow: item.allow,
    };

    if (item.target) q.target = {$objMatch: item.target};
    if (item.entity) q.entity = {$objMatch: item.entity};

    queries.push(q);
  });

  await ctx.data.permissionItem.deleteManyByQueries(ctx, queries);
};

export default deletePermissionItems;
