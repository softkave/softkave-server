import {merge} from 'lodash';
import {SystemActionType, SystemResourceType} from '../../../models/system';
import {IBoard} from '../../../mongo/block/board';
import {ITask} from '../../../mongo/block/task';
import {ISprint} from '../../../mongo/sprint/definitions';
import {getDate, indexArray} from '../../../utilities/fns';
import {validate} from '../../../utilities/joiUtils';
import {assertBoard} from '../../boards/utils';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getAssignPermissionPermQueries} from '../../permissions/permissionQueries';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {fireAndForgetPromise} from '../../utils';
import {getUpdateTaskPermQueries} from '../permissionQueries';
import {assertTask, getPublicTaskData} from '../utils';
import processUpdateTaskInput from './processUpdateBlockInput';
import sendNewlyAssignedTaskEmail from './sendNewAssignedTaskEmail';
import {UpdateTaskEndpoint} from './types';
import {updateTaskJoiSchema} from './validation';

const updateTask: UpdateTaskEndpoint = async (ctx, d) => {
  const data = validate(d.data, updateTaskJoiSchema);
  const updateData = data.data;
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const task = await ctx.data.task.getOneByQuery(ctx, {customId: data.taskId});
  assertTask(task);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: task.workspaceId,
    actionTarget: task,
    ...getUpdateTaskPermQueries(task.workspaceId, task.boardId, task.customId),
  });

  if (data.data.visibility !== undefined) {
    const accessChecker = await getCheckAuthorizationChecker({
      ctx,
      user,
      orgId: task.boardId,
      ...getAssignPermissionPermQueries(task.boardId, {
        containerId: task.boardId,
        containerType: SystemResourceType.Board,
      }),
    });
  }

  // boardId update ( tranferring block ) is handled separately by transferBlock
  const newBoardId = updateData.boardId;
  delete updateData.boardId;
  let existingSprint: ISprint | null = null;
  let newSprint: ISprint | null = null;
  let existingSprintId = '';
  let newSprintId = '';
  const sprintIds: string[] = [];
  let sprintsResult: ISprint[] = [];

  const board = await ctx.data.board.getOneByQuery<IBoard>(ctx, {customId: task.boardId});
  assertBoard(board);

  if (task.taskSprint?.sprintId) {
    sprintIds.push(task.taskSprint.sprintId);
    existingSprintId = task.taskSprint.sprintId;
  }

  if (data.data.taskSprint?.sprintId) {
    sprintIds.push(data.data.taskSprint.sprintId);
    newSprintId = data.data.taskSprint.sprintId;
  }

  if (sprintIds.length > 0) {
    sprintsResult = await ctx.sprint.getMany(ctx, sprintIds);
  }

  sprintsResult.forEach(sprint => {
    switch (sprint.customId) {
      case existingSprintId:
        existingSprint = sprint;
        break;
      case newSprintId:
        newSprint = sprint;
        break;
    }
  });

  const update = processUpdateTaskInput(task, updateData, user, board, existingSprint, newSprint);
  if (update.assignees && update.assignees?.length > 0) {
    const users = await ctx.user.bulkGetUsersById(
      ctx,
      update.assignees.map(a => a.userId)
    );

    const usersMap = indexArray(users, {path: 'customId'});
    update.assignees = update.assignees.filter(assignee => {
      const assigneeUserData = usersMap[assignee.userId];
      if (!assigneeUserData) {
        return false;
      }

      return !!assigneeUserData.workspaces.find(item => item.customId === task.workspaceId);
    });
  }

  if (newBoardId && task.boardId !== newBoardId) {
    const destBoard = await ctx.data.board.getOneByQuery<IBoard>(ctx, {customId: newBoardId});
    assertBoard(destBoard);

    const status0 = destBoard.boardStatuses[0];
    const boardIdChangeUpdates: Partial<ITask> = {
      boardId: destBoard.customId,
      status: status0 ? status0.customId : undefined,
      statusAssignedAt: status0 ? getDate() : undefined,
      statusAssignedBy: status0 ? user.customId : undefined,
      labels: [],
      taskSprint: undefined,
      taskResolution: undefined,
    };

    merge(update, boardIdChangeUpdates);
  }

  const updatedTask = await ctx.data.task.getAndUpdateOneByQuery(
    ctx,
    {customId: data.taskId},
    update
  );
  assertTask(updatedTask);
  fireAndForgetPromise(sendNewlyAssignedTaskEmail(ctx, d, task, update, updatedTask));
  const taskData = getPublicTaskData(updatedTask);
  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getBoardRoomName(updatedTask.boardId), {
    actionType: SystemActionType.Update,
    resourceType: SystemResourceType.Task,
    resource: taskData,
  });

  return {task: taskData};
};

export default updateTask;
