import {SystemResourceType} from '../../models/system';
import {IPermissionGroupContainer} from '../../mongo/access-control/permissionGroup';
import {
  AuthPermissionQueries,
  makeSortByTargetSortFn,
} from '../contexts/authorization-checks/utils';

export function getReadOrgPermissionGroupsPermQueries(orgId: string) {
  const qContainers = AuthPermissionQueries.start('read-permission-group')
    .withContainerId(orgId, SystemResourceType.PermissionGroup)
    .getQueries();
  const qTargets = AuthPermissionQueries.start('read-permission-group')
    .withTargetId(orgId)
    .getQueries();
  return {qContainers, qTargets};
}

export function getReadBoardPermissionGroupsPermQueries(orgId: string, boardId: string) {
  const qContainers = AuthPermissionQueries.start('read-permission-group')
    .withContainerId(boardId, SystemResourceType.PermissionGroup)
    .getQueries();
  const qTargets = AuthPermissionQueries.start('read-permission-group')
    .withTargetId(orgId)
    .withTargetId(boardId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([boardId, orgId]);
  return {qContainers, qTargets, sortFn};
}

export function getReadPermissionGroupsPermQueries(
  orgId: string,
  container: IPermissionGroupContainer
) {
  return container.containerType === SystemResourceType.Workspace
    ? getReadOrgPermissionGroupsPermQueries(orgId)
    : getReadBoardPermissionGroupsPermQueries(orgId, container.containerId);
}

export function getCreateOrgPermissionGroupPermQueries(orgId: string) {
  const qTargets = AuthPermissionQueries.start('create-permission-group')
    .withTargetId(orgId)
    .getQueries();
  return {qTargets};
}

export function getCreateBoardPermissionGroupPermQueries(orgId: string, boardId: string) {
  const qTargets = AuthPermissionQueries.start('create-permission-group')
    .withTargetId(orgId)
    .withTargetId(boardId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([boardId, orgId]);
  return {qTargets, sortFn};
}

export function getCreatePermissionGroupsPermQueries(
  orgId: string,
  container: IPermissionGroupContainer
) {
  return container.containerType === SystemResourceType.Workspace
    ? getCreateOrgPermissionGroupPermQueries(orgId)
    : getCreateBoardPermissionGroupPermQueries(orgId, container.containerId);
}

export function getDeleteOrgPermissionGroupPermQueries(orgId: string, pgId: string) {
  const qTargets = AuthPermissionQueries.start('delete-permission-group')
    .withTargetId(orgId)
    .withTargetId(pgId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([pgId, orgId]);
  return {qTargets, sortFn};
}

export function getDeleteBoardPermissionGroupPermQueries(
  orgId: string,
  boardId: string,
  pgId: string
) {
  const qTargets = AuthPermissionQueries.start('delete-permission-group')
    .withTargetId(orgId)
    .withTargetId(boardId)
    .withTargetId(pgId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([pgId, boardId, orgId]);
  return {qTargets, sortFn};
}

export function getDeletePermissionGroupPermQueries(
  orgId: string,
  container: IPermissionGroupContainer,
  pgId: string
) {
  return container.containerType === SystemResourceType.Workspace
    ? getDeleteOrgPermissionGroupPermQueries(orgId, pgId)
    : getDeleteBoardPermissionGroupPermQueries(orgId, container.containerId, pgId);
}

export function getReadOrgPermissionGroupPermQueries(orgId: string, pgId: string) {
  const qTargets = AuthPermissionQueries.start('read-permission-group')
    .withTargetId(orgId)
    .withTargetId(pgId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([pgId, orgId]);
  return {qTargets, sortFn};
}

export function getReadBoardPermissionGroupPermQueries(
  orgId: string,
  boardId: string,
  pgId: string
) {
  const qTargets = AuthPermissionQueries.start('read-permission-group')
    .withTargetId(orgId)
    .withTargetId(boardId)
    .withTargetId(pgId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([pgId, boardId, orgId]);
  return {qTargets, sortFn};
}

export function getReadPermissionGroupPermQueries(
  orgId: string,
  container: IPermissionGroupContainer,
  pgId: string
) {
  return container.containerType === SystemResourceType.Workspace
    ? getReadOrgPermissionGroupPermQueries(orgId, pgId)
    : getReadBoardPermissionGroupPermQueries(orgId, container.containerId, pgId);
}

export function getUpdateOrgPermissionGroupPermQueries(orgId: string, pgId: string) {
  const qTargets = AuthPermissionQueries.start('update-permission-group')
    .withTargetId(orgId)
    .withTargetId(pgId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([pgId, orgId]);
  return {qTargets, sortFn};
}

export function getUpdateBoardPermissionGroupPermQueries(
  orgId: string,
  boardId: string,
  pgId: string
) {
  const qTargets = AuthPermissionQueries.start('update-permission-group')
    .withTargetId(orgId)
    .withTargetId(boardId)
    .withTargetId(pgId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([pgId, boardId, orgId]);
  return {qTargets, sortFn};
}

export function getUpdatePermissionGroupPermQueries(
  orgId: string,
  container: IPermissionGroupContainer,
  pgId: string
) {
  return container.containerType === SystemResourceType.Workspace
    ? getUpdateOrgPermissionGroupPermQueries(orgId, pgId)
    : getUpdateBoardPermissionGroupPermQueries(orgId, container.containerId, pgId);
}

export function getOrgAssignPermissionPermQueries(orgId: string) {
  const qTargets = AuthPermissionQueries.start('assign-permission')
    .withTargetId(orgId)
    .getQueries();
  return {qTargets};
}

export function getBoardAssignPermissionPermQueries(orgId: string, boardId: string) {
  const qTargets = AuthPermissionQueries.start('assign-permission')
    .withTargetId(orgId)
    .withTargetId(boardId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([boardId, orgId]);
  return {qTargets, sortFn};
}

export function getAssignPermissionPermQueries(
  orgId: string,
  container: IPermissionGroupContainer
) {
  return container.containerType === SystemResourceType.Workspace
    ? getOrgAssignPermissionPermQueries(orgId)
    : getBoardAssignPermissionPermQueries(orgId, container.containerId);
}

export function getOrgUpdatePermissionItemPermQueries(orgId: string) {
  const qTargets = AuthPermissionQueries.start('update-permissions')
    .withTargetId(orgId)
    .getQueries();
  return {qTargets};
}

export function getBoardUpdatePermissionItemPermQueries(orgId: string, boardId: string) {
  const qTargets = AuthPermissionQueries.start('update-permissions')
    .withTargetId(orgId)
    .withTargetId(boardId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([boardId, orgId]);
  return {qTargets, sortFn};
}

export function getUpdatePermissionsPermQueries(
  orgId: string,
  container: IPermissionGroupContainer
) {
  return container.containerType === SystemResourceType.Workspace
    ? getOrgUpdatePermissionItemPermQueries(orgId)
    : getBoardUpdatePermissionItemPermQueries(orgId, container.containerId);
}
