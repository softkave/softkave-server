import {compact, uniqBy} from 'lodash';
import {SystemResourceType} from '../../../models/system';
import {IPermissionItem} from '../../../mongo/access-control/permissionItem';
import {getDate, indexArray} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {IPermissionItemQuery} from '../../contexts/data/permission/type';
import {ResourceWithIdQuery, fetchResourceList} from '../../utils';
import {getAssignPermissionPermQueries} from '../permissionQueries';
import {CreatePermissionItemsEndpoint} from './types';
import {createPermissionItemsJoiSchema} from './validation';
import assert = require('assert');

const createPermissionItems: CreatePermissionItemsEndpoint = async (ctx, d) => {
  const data = validate(d.data, createPermissionItemsJoiSchema);
  const user = await ctx.session.getUser(ctx, d);

  let rQueries: ResourceWithIdQuery[] = [];
  data.items.forEach(item => {
    rQueries.push({id: item.target.targetId, type: item.target.targetType});
    rQueries.push({id: item.target.containerId, type: item.target.containerType});
    rQueries.push({id: item.entity.entityId, type: item.entity.entityType});
  });
  rQueries = uniqBy(rQueries, 'id');
  const resourceList = await fetchResourceList(ctx, rQueries);
  const rMap = indexArray(compact(resourceList), {path: 'customId'});

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

  // TODO: check that entity and target exist and that user can read them

  const pItems: IPermissionItem[] = [];
  const queries = data.items.map(item => {
    const q: IPermissionItemQuery = {
      workspaceId: data.organizationId,
      entity: {$objMatch: item.entity},
      action: item.action,
      target: {$objMatch: item.target},
      allow: item.allow,
    };
    const pItem: IPermissionItem = {
      customId: getNewId02(SystemResourceType.PermissionItem),
      workspaceId: data.organizationId,
      createdAt: getDate(),
      createdBy: user.customId,
      entity: item.entity,
      action: item.action,
      target: item.target,
      conditions: item.conditions,
      allow: item.allow,
      visibility: 'organization',
    };

    pItems.push(pItem);
    return q;
  });

  await ctx.data.permissionItem.deleteManyByQueries(ctx, queries);
  await ctx.data.permissionItem.insertList(ctx, pItems);

  return {items: pItems};
};

export default createPermissionItems;
