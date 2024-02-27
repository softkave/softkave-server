import { map } from 'lodash';
import { IResource, IWorkspaceResource } from '../../../models/resource';
import { SystemResourceType } from '../../../models/system';
import {
    IPermissionItem,
    IPermissionItemCondition,
    PermissionItemConditionOn,
} from '../../../mongo/access-control/permissionItem';
import { EavAttributes, IEavAssignedPermissionGroup } from '../../../mongo/eav/eav';
import { IUser } from '../../../mongo/user/definitions';
import { indexArray } from '../../../utilities/fns';
import { NotFoundError, PermissionDeniedError } from '../../errors';
import { isTask } from '../../tasks/utils';
import { ResourceWithIdQuery, fetchResourceList } from '../../utils';
import { IBaseContext } from '../IBaseContext';
import { IEavAssignedPermissionGroupQuery } from '../data/eav/type';
import { IPermissionItemQuery } from '../data/permission/type';

export interface ICheckAuthorizationParams {
  ctx: IBaseContext;
  orgId: string;
  user: IUser;
  nothrow?: boolean;
  qTargets?: Array<IPermissionItemQuery>;
  qContainers?: Array<IPermissionItemQuery>;
  actionTarget?: IResource | IResource[];
  sortFn?: <TParams extends ICheckAuthorizationParams = ICheckAuthorizationParams>(
    item01: IPermissionItem,
    item02: IPermissionItem,
    params: TParams
  ) => number;
}

const otherQueries: IPermissionItemQuery[] = [{action: '*'}];

export async function checkAuthorization(params: ICheckAuthorizationParams) {
  return new NoopCheckAuthorizationReturnedChecker();

  // const {ctx, nothrow, orgId, user, sortFn} = params;

  // if (!params.qContainers && !params.qTargets) {
  //   throw new ServerError();
  // }

  // const orgPublicPgId = await getOrganizationPublicPermissionGroupId(ctx, orgId);
  // const [userPgIdList, publicPgIdList] = await Promise.all([
  //   fetchAssignedPgIdList(ctx, orgId, user.customId),
  //   fetchAssignedPgIdList(ctx, orgId, orgPublicPgId),
  // ]);
  // userPgIdList.unshift(user.customId);
  // publicPgIdList.unshift(orgPublicPgId);
  // const entityIdList = userPgIdList.concat(publicPgIdList);

  // const infuseEntitiesToQueries = (queries: Array<IPermissionItemQuery>) => {
  //   return queries.reduce((arr, next) => {
  //     arr.push(
  //       {
  //         ...next,
  //         workspaceId: orgId,
  //         entity: {
  //           $objMatch: {entityId: user.customId, entityType: getUserType(user.customId)},
  //         },
  //       },
  //       {
  //         ...next,
  //         workspaceId: orgId,
  //         entity: {
  //           $objMatch: {
  //             entityId: {$in: entityIdList},
  //             entityType: SystemResourceType.PermissionGroup,
  //           },
  //         },
  //       }
  //     );
  //     return arr;
  //   }, [] as IPermissionItemQuery[]);
  // };

  // const qTargets: IPermissionItemQuery[] = params.qTargets
  //   ? infuseEntitiesToQueries(params.qTargets.concat(otherQueries))
  //   : [];
  // const qContainers = params.qContainers
  //   ? infuseEntitiesToQueries(params.qContainers.concat(otherQueries))
  //   : [];

  // let itemsTarget = qTargets.length
  //   ? await ctx.data.permissionItem.getManyByQueries(ctx, qTargets)
  //   : [];
  // let itemsContainer = qContainers.length
  //   ? await ctx.data.permissionItem.getManyByQueries(ctx, qContainers)
  //   : [];

  // const entitySortFn = makeSortByEntitySortFn(entityIdList);
  // itemsTarget = itemsTarget.sort((a, b) => {
  //   const eWeight = entitySortFn(a, b);
  //   const sWeight = sortFn ? sortFn(a, b, params) : 0;
  //   return eWeight + sWeight;
  // });

  // if (itemsTarget.length === 0 && itemsContainer.length === 0) {
  //   if (nothrow) return null;
  //   throw new PermissionDeniedError();
  // }

  // const {appliedItems: appliedItemsTarget} = await applyPermissionStageOneConditions(
  //   ctx,
  //   user,
  //   itemsTarget,
  //   ['entity', 'target']
  // );
  // const {appliedItems: appliedItemsContainer} = await applyPermissionStageOneConditions(
  //   ctx,
  //   user,
  //   itemsContainer,
  //   ['entity']
  // );

  // if (appliedItemsTarget.length === 0 && appliedItemsContainer.length === 0) {
  //   if (nothrow) return null;
  //   throw new PermissionDeniedError();
  // }

  // const checker = new CheckAuthorizationReturnedChecker(
  //   appliedItemsTarget,
  //   appliedItemsContainer,
  //   user
  // );

  // if (params.actionTarget) {
  //   toArray(params.actionTarget).forEach(resource => checker.assertCheckActionTarget(resource));
  // }

  // return checker;
}

export async function getCheckAuthorizationChecker(
  params: ICheckAuthorizationParams
): Promise<ICheckAuthorizationReturnedChecker> {
  const checker = await checkAuthorization(params);
  if (!checker) throw new PermissionDeniedError();
  return checker;
}

async function fetchAssignedPgIdList(ctx: IBaseContext, organizationId: string, entityId: string) {
  const pgIdMap: Record<string, string> = {};
  let nextQuery: IEavAssignedPermissionGroupQuery | null = {
    entityId,
    workspaceId: organizationId,
    attribute: EavAttributes.AssignedPermissionGroup,
  };

  while (nextQuery !== null) {
    const eavList: IEavAssignedPermissionGroup[] =
      await ctx.data.eav.getManyByQuery<IEavAssignedPermissionGroup>(ctx, nextQuery);
    eavList.sort((e01, e02) =>
      e01.value.permissionGroupId === e02.value.permissionGroupId
        ? e01.value.order - e02.value.order
        : 0
    );
    const iterationPgIdList: string[] = [];
    eavList.forEach(eav => {
      if (!pgIdMap[eav.value.permissionGroupId]) {
        pgIdMap[eav.value.permissionGroupId] = eav.value.permissionGroupId;
        iterationPgIdList.push(eav.value.permissionGroupId);
      }
    });

    if (iterationPgIdList.length > 0) {
      nextQuery = {
        workspaceId: organizationId,
        attribute: EavAttributes.AssignedPermissionGroup,
        entityId: {$in: iterationPgIdList},
        entityType: SystemResourceType.PermissionGroup,
      };
    } else {
      nextQuery = null;
    }
  }

  // JS objects maintain insertion order so order is maintained
  return Object.values(pgIdMap);
}

async function getPermissionConditionsEntitiesAndTargets(
  ctx: IBaseContext,
  items: IPermissionItem[],
  onList: PermissionItemConditionOn[]
) {
  const qEntitiesMap: Record<string, SystemResourceType> = {};
  const qTargetsMap: Record<string, SystemResourceType> = {};
  const onMap = indexArray(onList);

  items.forEach(item => {
    item.conditions.forEach(c => {
      if (c.on === 'entity' && onMap[c.on]) {
        qEntitiesMap[item.entity.entityId] = item.entity.entityType;
      } else if (c.on === 'target' && onMap[c.on]) {
        qTargetsMap[item.target.targetId] = item.target.targetType;
      }
    });
  });

  const toResourceQuery = (qMap: Record<string, SystemResourceType>) =>
    map(qMap, (type, id): ResourceWithIdQuery => ({id, type}));
  const qEntities = toResourceQuery(qEntitiesMap);
  const qTargets = toResourceQuery(qTargetsMap);

  // TODO: fetch in batches, or cache in memory, because we could fetching many
  // many targets when querying permission items by container. Alternatively,
  // when querying by container, we could defer conditions check until the item
  // is matched with a resource then we check.
  const entities = await fetchResourceList(ctx, qEntities);
  const targets = await fetchResourceList(ctx, qTargets);

  const checkNotFound = <T>(resourceList: Array<T | null>, qList: Array<ResourceWithIdQuery>) =>
    resourceList.map((r, i) => {
      if (!r) throw new NotFoundError(`Entity with ID ${qList[i].id} not found`);
      return r;
    });

  const compactEntities = checkNotFound(entities, qEntities);
  const compactTargets = checkNotFound(targets, qTargets);
  const entitiesMap = indexArray(compactEntities, {path: 'customId'});
  const targetsMap = indexArray(compactTargets, {path: 'customId'});

  return {entitiesMap, targetsMap, compactEntities, compactTargets};
}

function applyPermissionCondition(
  condition: IPermissionItemCondition,
  resource: IResource,
  actionEntity: IResource
) {
  switch (condition.field) {
    case 'customId':
      return resource.customId === condition.is;
    case 'createdBy':
      return (resource as IWorkspaceResource).createdBy === condition.is;
    case 'visibility':
      return (resource as IWorkspaceResource).visibility === condition.is;
    case 'is-author':
      return (resource as IWorkspaceResource).createdBy === actionEntity.customId;
    case 'is-assigned':
      if (isTask(resource)) {
        return resource.assignees.some(a => a.userId === actionEntity.customId);
      }
  }

  return false;
}

async function applyPermissionStageOneConditions(
  ctx: IBaseContext,
  user: IUser,
  items: IPermissionItem[],
  onList: PermissionItemConditionOn[]
) {
  const artifacts = await getPermissionConditionsEntitiesAndTargets(ctx, items, onList);
  const {entitiesMap, targetsMap} = artifacts;
  const onMap = indexArray(onList);
  const appliedItems: IPermissionItem[] = [];

  for (const item of items) {
    if (item.conditions.length) {
      let matchesConditions = true;

      for (const c of item.conditions) {
        let resource: any = undefined;

        if (c.on === 'entity' && onMap[c.on]) {
          resource = entitiesMap[item.entity.entityId];
        } else if (
          c.on === 'action-entity' &&
          (!c.actionEntityType ||
            c.actionEntityType.includes(SystemResourceType.User) ||
            c.actionEntityType.includes(SystemResourceType.AnonymousUser))
        ) {
          resource = user;
        } else if (c.on === 'target' && onMap[c.on]) {
          resource = targetsMap[item.target.targetId];
        }

        if (!resource || !applyPermissionCondition(c, resource, user)) {
          matchesConditions = false;
          break;
        }
      }

      if (matchesConditions) appliedItems.push(item);
    } else {
      appliedItems.push(item);
    }
  }

  return {...artifacts, appliedItems};
}

export interface ICheckAuthorizationReturnedChecker {
  checkActionTarget<T extends IResource>(
    resource: T
  ): {allow: false; item?: IPermissionItem} | {allow: true; item: undefined};
  assertCheckActionTarget<T extends IResource>(resource: T): void;
  filterActionTargets<T extends IResource>(resourceList: T[]): [T[], undefined[]];
}

// class CheckAuthorizationReturnedChecker implements ICheckAuthorizationReturnedChecker {
//   private itemsTargetMap: Partial<Record<string, IPermissionItem[]>> = {};

//   constructor(
//     private itemsTarget: IPermissionItem[],
//     private itemsContainer: IPermissionItem[],
//     private user: IUser
//   ) {
//     this.itemsTarget.forEach(item => {
//       let tItemList = this.itemsTargetMap[item.target.targetId];
//       if (!tItemList) tItemList = this.itemsTargetMap[item.target.targetId] = [];
//       tItemList.push(item);
//     });
//   }

//   checkActionTarget<T extends IResource>(
//     resource: T
//   ): {allow: false; item?: IPermissionItem} | {allow: true; item: IPermissionItem} {
//     const tItemList = this.itemsTargetMap[resource.customId] ?? [];
//     const tMatch = this.checkItemsWithTarget(tItemList, resource, ['action-target', 'target']);

//     if (tMatch) {
//       return tMatch;
//     }

//     const cMatch = this.checkItemsWithTarget(this.itemsContainer, resource, [
//       'action-target',
//       'target',
//     ]);

//     if (cMatch) {
//       return cMatch;
//     }

//     return {allow: false};
//   }

//   assertCheckActionTarget<T extends IResource>(resource: T): void {
//     const {allow, item} = this.checkActionTarget(resource);
//     if (!allow) throw new PermissionDeniedError({item});
//   }

//   filterActionTargets<T extends IResource>(resourceList: T[]) {
//     const checkResults = resourceList.map(resource => this.checkActionTarget(resource));
//     const result: [T[], IPermissionItem[]] = [[], []];

//     resourceList.forEach((resource, i) => {
//       const checkResult = checkResults[i];

//       if (checkResult.allow) {
//         result[0].push(resource);
//         result[1].push(checkResult.item);
//       }
//     });

//     return result;
//   }

//   private checkItemsWithTarget(
//     items: IPermissionItem[],
//     resource: IResource,
//     onList: PermissionItemConditionOn[]
//   ) {
//     const onMap = indexArray(onList);

//     for (const item of items) {
//       if (item.conditions.length) {
//         let matchesConditions = true;

//         for (const c of item.conditions) {
//           if (
//             c.on === 'action-target' &&
//             onMap[c.on] &&
//             (!c.actionTargetType ||
//               c.actionTargetType.includes(getResourceTypeFromId(resource.customId)))
//           ) {
//             matchesConditions = applyPermissionCondition(c, resource, this.user);
//           } else if (c.on === 'target' && onMap[c.on]) {
//             matchesConditions = applyPermissionCondition(c, resource, this.user);
//           }

//           if (!matchesConditions) break;
//         }

//         if (matchesConditions) return {item, allow: item.allow};
//       } else {
//         return {item, allow: item.allow};
//       }
//     }

//     return null;
//   }
// }

class NoopCheckAuthorizationReturnedChecker implements ICheckAuthorizationReturnedChecker {
  checkActionTarget<T extends IResource>(resource: T) {
    return {allow: true, item: undefined};
  }

  assertCheckActionTarget<T extends IResource>(resource: T): void {}

  filterActionTargets<T extends IResource>(resourceList: T[]): [T[], undefined[]] {
    return [resourceList, []];
  }
}
