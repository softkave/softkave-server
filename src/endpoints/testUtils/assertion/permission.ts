import {SystemResourceType} from '../../../models/system';
import {EavAttributes, IEavAssignedPermissionGroup} from '../../../mongo/eav/eav';
import {indexArray} from '../../../utilities/fns';
import {IEavAssignedPermissionGroupQuery} from '../../contexts/data/eav/type';
import {IBaseContext} from '../../contexts/IBaseContext';

export async function assertPermissionGroupsAssigneeeList(
  ctx: IBaseContext,
  pgIds: string[],
  holderId: string[],
  holderType: SystemResourceType
) {
  await Promise.all(
    holderId.map(id => assertPermissionGroupsAssigneee(ctx, pgIds, id, holderType))
  );
}

export async function assertPermissionGroupsAssigneee(
  ctx: IBaseContext,
  pgIds: string[],
  entityId: string,
  entityType: SystemResourceType
) {
  const eavAssignedPgQuery: IEavAssignedPermissionGroupQuery = {
    attribute: EavAttributes.AssignedPermissionGroup,
    value: {
      $objMatch: {
        entityId,
        entityType,
        permissionGroupId: {$in: pgIds},
      },
    },
  };

  const eavMatch = await ctx.data.eav.getManyByQuery<IEavAssignedPermissionGroup>(
    ctx,
    eavAssignedPgQuery
  );
  const eavMatchMap = indexArray(eavMatch, {indexer: item => item.value?.permissionGroupId});
  pgIds.forEach(id => {
    expect(eavMatchMap[id]).toBeTruthy();
  });
}

export async function assertPermissionGroupsAssigneeeListCount(
  ctx: IBaseContext,
  pgIds: string[],
  holderId: string[],
  holderType: SystemResourceType,
  count = 1
) {
  await Promise.all(
    holderId.map(id => assertPermissionGroupsAssigneeCount(ctx, pgIds, id, holderType, count))
  );
}

export async function assertPermissionGroupsAssigneeCount(
  ctx: IBaseContext,
  pgIds: string[],
  entityId: string,
  entityType: SystemResourceType,
  count = 1
) {
  const eavAssignedPgQuery: IEavAssignedPermissionGroupQuery = {
    attribute: EavAttributes.AssignedPermissionGroup,
    value: {
      $objMatch: {
        entityId,
        entityType,
        permissionGroupId: {$in: pgIds},
      },
    },
  };

  const eavMatch = await ctx.data.eav.getManyByQuery<IEavAssignedPermissionGroup>(
    ctx,
    eavAssignedPgQuery
  );
  const eavMatchMap = eavMatch.reduce((map, next) => {
    map[next.value.permissionGroupId] = (map[next.value.permissionGroupId] || 0) + 1;
    return map;
  }, {} as Record<string, number>);
  pgIds.forEach(id => {
    expect(eavMatchMap[id]).toBe(count);
  });
}
