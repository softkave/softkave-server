import { ResourceVisibilityMap } from '../../models/resource';
import { SystemResourceType } from '../../models/system';
import {
  IPermissionGroup,
  IPermissionGroupContainer,
} from '../../mongo/access-control/permissionGroup';
import {
  IPermissionItem,
  IPermissionItemEntity,
  SoftkavePermissionActions,
} from '../../mongo/access-control/permissionItem';
import {
  EavAttributes,
  IEavAssignedPermissionGroup,
  IEavOrganizationPermissionGroup,
} from '../../mongo/eav/eav';
import { assertArg, getDate } from '../../utilities/fns';
import { getNewId02 } from '../../utilities/ids';
import { IBaseContext } from '../contexts/IBaseContext';
import { authConstants } from '../contexts/authorization-checks/constants';
import { IEavAssignedPermissionGroupQuery } from '../contexts/data/eav/type';
import { NotFoundError, ResourceExistsError } from '../errors';
import { extractFields, getFields, omitMongoId, publicWorkspaceResourceFields } from '../utils';
import { INTERNAL_assignPermissionGroups } from './assignPermissionGroups/handler';
import { INTERNAL_createPermissionGroup } from './createPermissionGroup/handler';
import { IPublicPermissionGroup } from './types';

/**
 * Fetches assigned permission groups with the eav assigned items used to fetch
 * the permission groups.
 * @param ctx
 * @param data
 * @param fetchDeep - Whether to also fetch assigned permission groups
 * assigned to the already fetched permission groups.
 * @returns
 */
export async function getAssignedPermissionGroups(
  ctx: IBaseContext,
  workspaceId: string,
  entity: IPermissionItemEntity,
  fetchDeep = false
) {
  // TODO: we'd have to cache assigned permission groups in memory

  let completePermissionGroupList: IPermissionGroup[] = [];
  let completeEavMatchList: IEavAssignedPermissionGroup[] = [];
  const fetchedPgIdMap: Record<string, string> = {};
  let nextAssigneeIdList = [entity.entityId];
  let assigneeType = entity.entityType;

  while (nextAssigneeIdList.length > 0) {
    const query: IEavAssignedPermissionGroupQuery = {
      workspaceId,
      attribute: EavAttributes.AssignedPermissionGroup,
      value: {
        $objMatch: {
          entityId: {$in: nextAssigneeIdList},
          entityType: assigneeType,
        },
      },
    };

    // TODO: set page size and or perform in batches.
    const eavMatch = await ctx.data.eav.getManyByQuery<IEavAssignedPermissionGroup>(ctx, query);

    const iterationPgIdList: string[] = [];
    eavMatch.forEach(eav => {
      if (!fetchedPgIdMap[eav.value.permissionGroupId]) {
        fetchedPgIdMap[eav.value.permissionGroupId] = eav.value.permissionGroupId;
        iterationPgIdList.push(eav.value.permissionGroupId);
        completeEavMatchList.push(eav);
      }
    });

    const permissionGroupList = await ctx.data.permissionGroup.getManyByQuery(ctx, {
      workspaceId,
      customId: {$in: iterationPgIdList},
    });
    completePermissionGroupList = completePermissionGroupList.concat(permissionGroupList);

    // Fetch the permission groups assigned to the just fetched permission
    // groups if deep fetch is requested by replacing nextAssignedToIdList with
    // the IDs of the current permission groups which keeps the loop active.
    // Setting nextAssignedToIdList to an empty array ends the loop. The loop
    // also ends when there are no more permission groups returned from db.
    if (fetchDeep) {
      nextAssigneeIdList = permissionGroupList.map(p => p.customId);
      assigneeType = SystemResourceType.PermissionGroup;
    } else {
      nextAssigneeIdList = [];
    }
  }

  return {permissionGroupList: completePermissionGroupList, eavMatchList: completeEavMatchList};
}

export function isFetchingOwnAssignedPermissionGroups(
  entity: IPermissionItemEntity,
  userId: string
) {
  return entity.entityId === userId;
}

export function isFetchingOwnPermissions(
  entity: IPermissionItemEntity | undefined,
  userId: string
) {
  return entity?.entityId === userId;
}

const publicPermissionGroupFields = getFields<IPublicPermissionGroup>({
  ...publicWorkspaceResourceFields,
  container: omitMongoId,
  name: true,
  description: true,
  isSystemManaged: true,
  visibility: true,
});

export function getPublicPermissionGroupData(
  permissiongroup: Partial<IPermissionGroup>
): IPublicPermissionGroup {
  return extractFields(permissiongroup, publicPermissionGroupFields);
}

export function getPublicPermissionGroupsArray(
  permissiongroups: Array<Partial<IPermissionGroup>>
): IPublicPermissionGroup[] {
  return permissiongroups.map(permissiongroup =>
    extractFields(permissiongroup, publicPermissionGroupFields)
  );
}

export async function isPermissionGroupWithNameExisting(
  context: IBaseContext,
  container: IPermissionGroupContainer,
  name: string
) {
  return context.data.permissionGroup.existsByQuery(context, {
    name: {$regex: new RegExp(`^${name}$`, 'i')},
    container: {$objMatch: container},
  });
}

export async function assertPermissionGroupWithNameDoesNotExist(
  context: IBaseContext,
  container: IPermissionGroupContainer,
  name: string
) {
  const exists = await isPermissionGroupWithNameExisting(context, container, name);
  if (exists) throw new ResourceExistsError(`Permission group with name '${name}' exists`);
}

export function throwPermissionGroupNotFoundError() {
  throw new NotFoundError('Permission group not found');
}

export function assertPermissionGroup(data?: IPermissionGroup | null): asserts data {
  if (!data) {
    throwPermissionGroupNotFoundError();
  }
}

export async function tryGetOrganizationPublicPermissionGroupId(ctx: IBaseContext, orgId: string) {
  const eav = await ctx.data.eav.getOneByQuery<IEavOrganizationPermissionGroup>(ctx, {
    workspaceId: orgId,
    attribute: EavAttributes.PublicPermissionGroup,
  });
  if (eav) return eav.value.permissionGroupId;
  return null;
}

export async function getOrganizationPublicPermissionGroupId(ctx: IBaseContext, orgId: string) {
  // TODO: in the future, we may want to localize fetching the public permission
  // group ID from the org. It saves the round trip when we have the org, and we
  // can just fetch the org with projection when we don't.
  const id = await tryGetOrganizationPublicPermissionGroupId(ctx, orgId);
  assertArg(id, new Error(`Public permission group not found for org '${orgId}'`));
  return id;
}

export async function insertOrgAdminPermissions(
  ctx: IBaseContext,
  userId: string,
  workspaceId: string,
  adminPgId: string
) {
  const pItem: IPermissionItem = {
    customId: getNewId02(SystemResourceType.PermissionItem),
    workspaceId: workspaceId,
    createdAt: getDate(),
    createdBy: userId,
    entity: {entityId: adminPgId, entityType: SystemResourceType.PermissionGroup},
    action: '*',
    target: {
      targetId: workspaceId,
      targetType: SystemResourceType.Workspace,
      containerId: workspaceId,
      containerType: SystemResourceType.Workspace,
    },
    conditions: [],
    allow: true,
    visibility: 'organization',
  };
  await ctx.data.permissionItem.insertList(ctx, [pItem]);
}

export async function insertBoardAdminPermissions(
  ctx: IBaseContext,
  userId: string,
  workspaceId: string,
  boardId: string,
  adminPgId: string
) {
  const pItem: IPermissionItem = {
    workspaceId: workspaceId,
    customId: getNewId02(SystemResourceType.PermissionItem),
    createdAt: getDate(),
    createdBy: userId,
    entity: {entityId: adminPgId, entityType: SystemResourceType.PermissionGroup},
    action: '*',
    target: {
      targetId: boardId,
      targetType: SystemResourceType.Board,
      containerId: workspaceId,
      containerType: SystemResourceType.Workspace,
    },
    conditions: [
      {
        field: 'customId',
        on: 'target',
        is: boardId,
      },
    ],
    allow: true,
    visibility: 'board',
  };
  await ctx.data.permissionItem.insertList(ctx, [pItem]);
}

export async function insertOrgMemberPermissions(
  ctx: IBaseContext,
  userId: string,
  workspaceId: string,
  memberPgId: string
) {
  const actions_orgVisibility: SoftkavePermissionActions[] = [
    'read-org',
    'read-board',
    'read-task',
    'chat',
    'read-collaborator',
    'read-sprint',
  ];
  const actions_isAssigned: SoftkavePermissionActions[] = ['toggle-task', 'toggle-subtask'];

  const pItems: IPermissionItem[] = [];
  actions_orgVisibility.forEach(action => {
    const pItem: IPermissionItem = {
      workspaceId: workspaceId,
      action,
      customId: getNewId02(SystemResourceType.PermissionItem),
      createdAt: getDate(),
      createdBy: userId,
      entity: {entityId: memberPgId, entityType: SystemResourceType.PermissionGroup},
      target: {
        targetId: workspaceId,
        targetType: SystemResourceType.Workspace,
        containerId: workspaceId,
        containerType: SystemResourceType.Workspace,
      },
      conditions: [
        {
          field: 'visibility',
          is: ResourceVisibilityMap.Workspace,
          on: 'action-target',
        },
        {
          field: 'visibility',
          is: ResourceVisibilityMap.Workspace,
          on: 'target',
        },
      ],
      allow: true,
      visibility: 'organization',
    };
    pItems.push(pItem);
  });
  actions_isAssigned.forEach(action => {
    const pItem: IPermissionItem = {
      workspaceId: workspaceId,
      action,
      customId: getNewId02(SystemResourceType.PermissionItem),
      createdAt: getDate(),
      createdBy: userId,
      entity: {entityId: memberPgId, entityType: SystemResourceType.PermissionGroup},
      target: {
        targetId: workspaceId,
        targetType: SystemResourceType.Workspace,
        containerId: workspaceId,
        containerType: SystemResourceType.Workspace,
      },
      conditions: [
        {
          field: 'is-assigned',
          is: true,
          on: 'action-target',
        },
      ],
      allow: true,
      visibility: 'organization',
    };
    pItems.push(pItem);
  });

  await ctx.data.permissionItem.insertList(ctx, pItems);
}

export async function insertBoardMemberPermissions(
  ctx: IBaseContext,
  userId: string,
  workspaceId: string,
  boardId: string,
  memberPgId: string
) {
  const actions_orgVisibility: SoftkavePermissionActions[] = [
    'read-board',
    'read-task',
    'read-collaborator',
    'read-sprint',
  ];
  const actions_isAssigned: SoftkavePermissionActions[] = ['toggle-task', 'toggle-subtask'];

  const pItems: IPermissionItem[] = [];
  actions_orgVisibility.forEach(action => {
    const pItem: IPermissionItem = {
      workspaceId: workspaceId,
      action,
      customId: getNewId02(SystemResourceType.PermissionItem),
      createdAt: getDate(),
      createdBy: userId,
      entity: {entityId: memberPgId, entityType: SystemResourceType.PermissionGroup},
      target: {
        targetId: boardId,
        targetType: SystemResourceType.Board,
        containerId: workspaceId,
        containerType: SystemResourceType.Workspace,
      },
      conditions: [
        {
          field: 'visibility',
          is: ResourceVisibilityMap.Board,
          on: 'action-target',
        },
        {
          field: 'visibility',
          is: ResourceVisibilityMap.Board,
          on: 'target',
        },
        {
          field: 'customId',
          is: boardId,
          on: 'target',
        },
      ],
      allow: true,
      visibility: 'board',
    };
    pItems.push(pItem);
  });
  actions_isAssigned.forEach(action => {
    const pItem: IPermissionItem = {
      workspaceId: workspaceId,
      action,
      customId: getNewId02(SystemResourceType.PermissionItem),
      createdAt: getDate(),
      createdBy: userId,
      entity: {entityId: memberPgId, entityType: SystemResourceType.PermissionGroup},
      target: {
        targetId: boardId,
        targetType: SystemResourceType.Board,
        containerId: workspaceId,
        containerType: SystemResourceType.Workspace,
      },
      conditions: [
        {
          field: 'is-assigned',
          is: true,
          on: 'action-target',
        },
      ],
      allow: true,
      visibility: 'board',
    };
    pItems.push(pItem);
  });

  await ctx.data.permissionItem.insertList(ctx, pItems);
}

export async function insertOrgPublicPermissionGroup(
  ctx: IBaseContext,
  userId: string,
  orgId: string,
  publicPgId: string
) {
  const eav: IEavOrganizationPermissionGroup = {
    customId: getNewId02(SystemResourceType.Eav),
    workspaceId: orgId,
    createdAt: getDate(),
    entityId: orgId,
    entityType: SystemResourceType.Workspace,
    attribute: EavAttributes.PublicPermissionGroup,
    value: {permissionGroupId: publicPgId},
    meta: {},
  };
  ctx.data.eav.insertList(ctx, [eav]);
}

export async function setupOrgPermissionGroups(ctx: IBaseContext, userId: string, orgId: string) {
  const [publicPg, adminPg, memberPg] = await Promise.all([
    INTERNAL_createPermissionGroup(
      ctx,
      userId,
      orgId,
      {
        name: authConstants.publicPgName,
        description: 'System managed permission group for public users',
        container: {containerId: orgId, containerType: SystemResourceType.Workspace},
      },
      {isSystemManaged: true}
    ),
    INTERNAL_createPermissionGroup(ctx, userId, orgId, {
      name: authConstants.adminPgName,
      description: 'Auto-generated permission group with access to all resources and actions',
      container: {containerId: orgId, containerType: SystemResourceType.Workspace},
    }),
    INTERNAL_createPermissionGroup(ctx, userId, orgId, {
      name: authConstants.memberPgName,
      description: 'Auto-generated permission group with minimal access needed for work',
      container: {containerId: orgId, containerType: SystemResourceType.Workspace},
    }),
  ]);

  // TODO: use mongo transactions
  await Promise.all([
    insertOrgAdminPermissions(ctx, userId, orgId, adminPg.customId),
    insertOrgMemberPermissions(ctx, userId, orgId, memberPg.customId),
    INTERNAL_assignPermissionGroups(ctx, userId, orgId, [
      {
        entity: {entityId: userId, entityType: SystemResourceType.User},
        permissionGroupId: adminPg.customId,
        order: 0,
      },
    ]),
    insertOrgPublicPermissionGroup(ctx, userId, orgId, publicPg.customId),
    ctx.data.workspace.updateOneByQuery(
      ctx,
      {customId: orgId},
      {publicPermissionGroupId: publicPg.customId}
    ),
  ]);

  return {adminPg, publicPg, memberPg};
}

export async function setupBoardPermissionGroups(
  ctx: IBaseContext,
  userId: string,
  orgId: string,
  boardId: string
) {
  const [adminPg, memberPg] = await Promise.all([
    INTERNAL_createPermissionGroup(ctx, userId, orgId, {
      name: authConstants.adminPgName,
      description: 'Auto-generated permission group with access to all resources and actions',
      container: {containerId: boardId, containerType: SystemResourceType.Board},
    }),
    INTERNAL_createPermissionGroup(ctx, userId, orgId, {
      name: authConstants.memberPgName,
      description: 'Auto-generated permission group with minimal access needed for work',
      container: {containerId: boardId, containerType: SystemResourceType.Board},
    }),
  ]);

  // TODO: use mongo transactions
  await Promise.all([
    insertBoardAdminPermissions(ctx, userId, orgId, boardId, adminPg.customId),
    insertBoardMemberPermissions(ctx, userId, orgId, boardId, memberPg.customId),
  ]);

  return {adminPg, memberPg};
}
