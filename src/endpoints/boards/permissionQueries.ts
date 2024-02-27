import {SystemResourceType} from '../../models/system';
import {IBoard} from '../../mongo/block/board';
import {
  AuthPermissionQueries,
  makeSortByTargetSortFn,
} from '../contexts/authorization-checks/utils';

export function getReadOrgBoardsPermQueries(orgId: string) {
  const qContainers = AuthPermissionQueries.start('read-board')
    .withContainerId(orgId, SystemResourceType.Board)
    .getQueries();
  const qTargets = AuthPermissionQueries.start('read-board').withTargetId(orgId).getQueries();
  return {qContainers, qTargets};
}

export function getCreateBoardPermQueries(orgId: string) {
  const qTargets = AuthPermissionQueries.start('create-board').withTargetId(orgId).getQueries();
  return {qTargets};
}

export function getDeleteBoardPermQueries(board: IBoard) {
  const qTargets = AuthPermissionQueries.start('delete-board')
    .withTargetId(board.workspaceId)
    .withTargetId(board.customId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([board.customId, board.workspaceId]);
  return {qTargets, sortFn};
}

export function getReadBoardPermQueries(board: IBoard) {
  const qTargets = AuthPermissionQueries.start('read-board')
    .withTargetId(board.workspaceId)
    .withTargetId(board.customId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([board.customId, board.workspaceId]);
  return {qTargets, sortFn};
}

export function getUpdateBoardPermQueries(board: IBoard) {
  const qTargets = AuthPermissionQueries.start('update-board')
    .withTargetId(board.workspaceId)
    .withTargetId(board.customId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([board.customId, board.workspaceId]);
  return {qTargets, sortFn};
}
