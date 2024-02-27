import {SystemResourceType} from '../../models/system';
import {IBoard} from '../../mongo/block/board';
import {ITask} from '../../mongo/block/task';
import {
  AuthPermissionQueries,
  makeSortByTargetSortFn,
} from '../contexts/authorization-checks/utils';

export function getReadTasksPermQueries(boardId: string, orgId: string) {
  const qContainers = AuthPermissionQueries.start('read-task')
    .withContainerId(boardId, SystemResourceType.Task)
    .getQueries();
  const qTargets = AuthPermissionQueries.start('read-task')
    .withTargetId(orgId)
    .withTargetId(boardId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([boardId, orgId]);
  return {qContainers, qTargets, sortFn};
}

export function getCreateTaskPermQueries(board: IBoard) {
  const qTargets = AuthPermissionQueries.start('create-task')
    .withTargetId(board.workspaceId)
    .withTargetId(board.customId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([board.customId, board.workspaceId]);
  return {qTargets, sortFn};
}

export function getDeleteTaskPermQueries(task: ITask) {
  const qTargets = AuthPermissionQueries.start('delete-task')
    .withTargetId(task.workspaceId)
    .withTargetId(task.boardId)
    .withTargetId(task.customId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([task.customId, task.boardId, task.workspaceId]);
  return {qTargets, sortFn};
}

export function getUpdateTaskPermQueries(workspaceId: string, boardId: string, taskId: string) {
  const qTargets = AuthPermissionQueries.start('update-task')
    .withTargetId(workspaceId)
    .withTargetId(boardId)
    .withTargetId(taskId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([taskId, boardId, workspaceId]);
  return {qTargets, sortFn};
}

export function getUpdateBoardTasksPermQueries(workspaceId: string, boardId: string) {
  const qTargets = AuthPermissionQueries.start('update-task')
    .withTargetId(workspaceId)
    .withTargetId(boardId)
    .getQueries();
  const sortFn = makeSortByTargetSortFn([boardId, workspaceId]);
  return {qTargets, sortFn};
}
