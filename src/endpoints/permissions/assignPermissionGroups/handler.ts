import {SystemResourceType} from '../../../models/system';
import {IPermissionGroup} from '../../../mongo/access-control/permissionGroup';
import {EavAttributes, IEavAssignedPermissionGroup} from '../../../mongo/eav/eav';
import {getDate, indexArray} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {validate} from '../../../utilities/joiUtils';
import {IBaseContext} from '../../contexts/IBaseContext';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {IEavAssignedPermissionGroupQuery} from '../../contexts/data/eav/type';
import {getAssignPermissionPermQueries} from '../permissionQueries';
import {AssignPermissionGroupsEndpoint, IAssignPermissionGroupInputItem} from './types';
import {assignPermissionGroupsJoiSchema} from './validation';

export const assignPermissionGroupsEndpoint: AssignPermissionGroupsEndpoint = async (ctx, d) => {
  const data = validate(d.data, assignPermissionGroupsJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);

  const {pgList} = await getPgListFromAssignPgListItems(ctx, data.items);
  const accessCheckers = await Promise.all(
    pgList.map(pg =>
      getCheckAuthorizationChecker({
        ctx,
        user,
        orgId: pg.workspaceId,
        actionTarget: pg,
        ...getAssignPermissionPermQueries(pg.workspaceId, pg.container),
      })
    )
  );

  await INTERNAL_assignPermissionGroups(
    ctx,
    user.customId,
    data.organizationId,
    data.items,
    pgList
  );
};

export async function INTERNAL_assignPermissionGroups(
  ctx: IBaseContext,
  userId: string,
  organizationId: string,
  items: IAssignPermissionGroupInputItem[],
  pgList?: IPermissionGroup[]
) {
  if (!pgList) {
    ({pgList} = await getPgListFromAssignPgListItems(ctx, items));
  }

  const pgMap = indexArray(pgList, {path: 'customId'});
  const queries: IEavAssignedPermissionGroupQuery[] = [];
  const eavs: IEavAssignedPermissionGroup[] = [];
  items.forEach(item => {
    const pg = pgMap[item.permissionGroupId];
    if (!pg) return;

    const q: IEavAssignedPermissionGroupQuery = {
      workspaceId: organizationId,
      attribute: EavAttributes.AssignedPermissionGroup,
      value: {
        $objMatch: {
          permissionGroupId: pg.customId,
          containerId: pg.container.containerId,
          containerType: pg.container.containerType,
          entityId: item.entity.entityId,
          entityType: item.entity.entityType,
        },
      },
    };
    const eav: IEavAssignedPermissionGroup = {
      workspaceId: organizationId,
      customId: getNewId02(SystemResourceType.Eav),
      createdAt: getDate(),
      createdBy: userId,
      entityId: item.entity.entityId,
      entityType: item.entity.entityType,
      attribute: EavAttributes.AssignedPermissionGroup,
      value: {
        permissionGroupId: pg.customId,
        containerId: pg.container.containerId,
        containerType: pg.container.containerType,
        entityId: item.entity.entityId,
        entityType: item.entity.entityType,
        assignedAt: getDate(),
        assignedBy: userId,
        order: item.order || Number.MAX_SAFE_INTEGER,
      },
      meta: {},
    };

    queries.push(q);
    eavs.push(eav);
  });

  await ctx.data.eav.deleteManyByQueries(ctx, queries);
  await ctx.data.eav.insertList(ctx, eavs);
}

async function getPgListFromAssignPgListItems(
  ctx: IBaseContext,
  items: IAssignPermissionGroupInputItem[]
) {
  const pgIdList = items.map(item => item.permissionGroupId);
  const pgList = await ctx.data.permissionGroup.getManyByQuery(ctx, {customId: {$in: pgIdList}});
  return {pgList, pgIdList};
}
