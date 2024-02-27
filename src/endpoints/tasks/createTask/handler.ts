import {SystemActionType, SystemResourceType} from '../../../models/system';
import {ITask} from '../../../mongo/block/task';
import {getDate} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {validate} from '../../../utilities/joiUtils';
import {assertBoard} from '../../boards/utils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {getAssignPermissionPermQueries} from '../../permissions/permissionQueries';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {getCreateTaskPermQueries} from '../permissionQueries';
import {getPublicTaskData} from '../utils';
import {CreateTaskEndpoint} from './types';
import {createTaskJoiSchema} from './validation';

const createTask: CreateTaskEndpoint = async (ctx, d) => {
  const data = validate(d.data, createTaskJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const board = await ctx.data.board.getOneByQuery(ctx, {customId: data.task.boardId});
  assertBoard(board);
  assertBoard(board);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: data.task.workspaceId,
    actionTarget: board,
    ...getCreateTaskPermQueries(board),
  });

  if (data.task.visibility) {
    const accessChecker = await getCheckAuthorizationChecker({
      ctx,
      user,
      orgId: data.task.boardId,
      ...getAssignPermissionPermQueries(data.task.boardId, {
        containerId: data.task.boardId,
        containerType: SystemResourceType.Board,
      }),
    });
  }

  const task: ITask = {
    customId: getNewId02(SystemResourceType.Task),
    createdBy: user.customId,
    createdAt: getDate(),
    name: data.task.name,
    description: data.task.description,
    boardId: data.task.boardId,
    workspaceId: data.task.workspaceId,
    assignees: data.task.assignees.map(item => ({
      assignedAt: getDate(),
      assignedBy: user.customId,
      userId: item.userId,
    })),
    priority: data.task.priority,
    subTasks: data.task.subTasks.map(item => ({
      createdAt: getDate(),
      createdBy: user.customId,
      customId: item.customId,
      description: item.description,
      completedBy: item.completedBy,
      completedAt: item.completedBy ? getDate() : undefined,
    })),
    status: data.task.status,
    statusAssignedBy: data.task.status ? user.customId : undefined,
    statusAssignedAt: data.task.status ? getDate() : undefined,
    taskResolution: data.task.taskResolution,
    labels: data.task.labels.map(item => ({
      assignedAt: getDate(),
      assignedBy: user.customId,
      labelId: item.labelId,
    })),
    dueAt: data.task.dueAt,
    taskSprint: data.task.taskSprint
      ? {
          assignedAt: getDate(),
          assignedBy: user.customId,
          sprintId: data.task.taskSprint.sprintId,
        }
      : undefined,
    visibility: data.task.visibility ?? 'organization',
  };

  await ctx.data.task.insertList(ctx, [task]);
  const taskData = getPublicTaskData(task);
  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getBoardRoomName(task.boardId), {
    actionType: SystemActionType.Create,
    resourceType: SystemResourceType.Task,
    resource: taskData,
  });

  return {
    task: getPublicTaskData(task),
  };
};

export default createTask;
