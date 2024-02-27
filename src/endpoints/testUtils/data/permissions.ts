import {faker} from '@faker-js/faker';
import {flattenDeep, isArray} from 'lodash';
import {SystemResourceType} from '../../../models/system';
import {IPermissionGroup} from '../../../mongo/access-control/permissionGroup';
import {IPermissionItem} from '../../../mongo/access-control/permissionItem';
import {EavAttributes} from '../../../mongo/eav/eav';
import {extractResourceIdList, getDate} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {IBaseContext} from '../../contexts/IBaseContext';
import {randomAction} from './data';
import {seedEavAssignedPermissionGroups} from './eav';

export function seedPermissionsTargetType() {
  return faker.helpers.arrayElement([SystemResourceType.Workspace, SystemResourceType.Board]);
}

export function seedPermissionsAssigneeType() {
  return faker.helpers.arrayElement([
    SystemResourceType.User,
    SystemResourceType.AnonymousUser,
    SystemResourceType.PermissionGroup,
  ]);
}

export function seedRandomPermissions(count: number, partial: Partial<IPermissionItem> = {}) {
  const p: IPermissionItem[] = [];
  for (let i = 0; i < count; i++) {
    const targetType = seedPermissionsTargetType();
    const containerType = SystemResourceType.Workspace;
    const entityType = seedPermissionsAssigneeType();
    p.push({
      customId: getNewId02(SystemResourceType.PermissionItem),
      workspaceId: getNewId02(SystemResourceType.Workspace),
      createdAt: getDate(),
      createdBy: getNewId02(SystemResourceType.User),
      entity: {
        entityType,
        entityId: getNewId02(entityType),
      },
      target: {
        targetType,
        containerType,
        targetId: getNewId02(targetType),
        containerId: getNewId02(containerType),
      },
      action: randomAction(),
      allow: faker.datatype.boolean(),
      visibility: 'organization',
      conditions: [],
      ...partial,
    });
  }

  return p;
}

export function seedRandomPermissionGroups(count: number, partial: Partial<IPermissionGroup> = {}) {
  const p: IPermissionGroup[] = [];
  for (let i = 0; i < count; i++) {
    const orgId = getNewId02(SystemResourceType.Workspace);
    p.push({
      customId: getNewId02(SystemResourceType.PermissionGroup),
      workspaceId: orgId,
      createdAt: getDate(),
      createdBy: getNewId02(SystemResourceType.User),
      container: {containerId: orgId, containerType: SystemResourceType.Workspace},
      name: faker.lorem.words(5),
      visibility: 'organization',
      ...partial,
    });
  }
  return p;
}

export async function seedInsertAndAssignPermissionGroups(
  ctx: IBaseContext,
  partial: Partial<IPermissionGroup> = {},
  entityId: string | string[],
  entityType: SystemResourceType,
  count = 3
) {
  const pgList = seedRandomPermissionGroups(count, partial);
  await ctx.data.permissionGroup.insertList(ctx, pgList);
  await insertAssignPermissionGroups(
    ctx,
    pgList[0].workspaceId,
    extractResourceIdList(pgList),
    entityId,
    entityType
  );
  return pgList;
}

export async function insertAssignPermissionGroups(
  ctx: IBaseContext,
  organizationId: string,
  pgIdList: string[],
  entityId: string | string[],
  entityType: SystemResourceType
) {
  const entityIdList = isArray(entityId) ? entityId : [entityId];
  const eavList = flattenDeep(
    pgIdList.map(item =>
      entityIdList.map(id =>
        seedEavAssignedPermissionGroups(1, {
          workspaceId: organizationId,
          entityType,
          entityId: id,
          attribute: EavAttributes.AssignedPermissionGroup,
          value: {
            entityType,
            entityId: id,
            permissionGroupId: item,
          },
        })
      )
    )
  );

  await ctx.data.eav.insertList(ctx, eavList);
}

export async function seedAndInsertPermissionGroups(
  ctx: IBaseContext,
  partial: Partial<IPermissionGroup> = {},
  count = 3
) {
  const pgList = seedRandomPermissionGroups(count, partial);
  await ctx.data.permissionGroup.insertList(ctx, pgList);
  return pgList;
}
