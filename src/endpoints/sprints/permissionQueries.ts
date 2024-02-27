import {SystemResourceType} from '../../models/system';
import {IBoard} from '../../mongo/block/board';
import {
  AuthPermissionQueries,
  makeSortByTargetSortFn,
} from '../contexts/authorization-checks/utils';

export function getReadSprintsPermQueries(board: IBoard) {
  const qContainers = AuthPermissionQueries.start('read-sprint')
    .withContainerId(board.customId, SystemResourceType.Sprint)
    .getQueries();
  const qTargets = AuthPermissionQueries.start('read-sprint')
    .withTargetId(board.workspaceId)
    .withTargetId(board.customId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([board.customId, board.workspaceId]);
  return {qContainers, qTargets, sortFn};
}

export function getCreateSprintPermQueries(board: IBoard) {
  const qTargets = AuthPermissionQueries.start('create-sprint')
    .withTargetId(board.workspaceId)
    .withTargetId(board.customId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([board.customId, board.workspaceId]);
  return {qTargets, sortFn};
}

export function getDeleteSprintPermQueries(board: IBoard, sprintId: string) {
  const qTargets = AuthPermissionQueries.start('delete-sprint')
    .withTargetId(board.workspaceId)
    .withTargetId(board.customId)
    .withTargetId(sprintId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([sprintId, board.customId, board.workspaceId]);
  return {qTargets, sortFn};
}

export function getUpdateSprintPermQueries(board: IBoard, sprintId: string) {
  const qTargets = AuthPermissionQueries.start('update-sprint')
    .withTargetId(board.workspaceId)
    .withTargetId(board.customId)
    .withTargetId(sprintId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([sprintId, board.customId, board.workspaceId]);
  return {qTargets, sortFn};
}
