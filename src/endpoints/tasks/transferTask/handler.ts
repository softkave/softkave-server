import {ITask} from '../../../mongo/block/task';
import {getDate} from '../../../utilities/fns';
import {validate} from '../../../utilities/joiUtils';
import {assertBoard} from '../../boards/utils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getUpdateBoardTasksPermQueries, getUpdateTaskPermQueries} from '../permissionQueries';
import {assertTask, getPublicTaskData} from '../utils';
import {TransferTaskEndpoint} from './types';
import {transferTaskJoiSchema} from './validation';

const transferTask: TransferTaskEndpoint = async (ctx, d) => {
  const data = validate(d.data, transferTaskJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const [task, board] = await Promise.all([
    ctx.data.task.getOneByQuery(ctx, {customId: data.taskId}),
    ctx.data.board.getOneByQuery(ctx, {customId: data.boardId}),
  ]);
  assertTask(task);
  assertBoard(board);

  const [ac1, ac2] = await Promise.all([
    // check if user can update task in current board
    getCheckAuthorizationChecker({
      ctx,
      user,
      orgId: task.workspaceId,
      ...getUpdateTaskPermQueries(task.workspaceId, task.boardId, task.customId),
    }),

    // check if user can update task in destination board
    getCheckAuthorizationChecker({
      ctx,
      user,
      orgId: task.workspaceId,
      ...getUpdateBoardTasksPermQueries(task.workspaceId, board.customId),
    }),
  ]);

  // TODO: check that all parents are of the block's parent type

  if (task.boardId === board.customId) {
    return {};
  }

  const status0 = board.boardStatuses[0];
  const taskUpdates: Partial<ITask> = {
    lastUpdatedAt: getDate(),
    lastUpdatedBy: user.customId,
    boardId: board.customId,
    status: status0 ? status0.customId : undefined,
    statusAssignedAt: status0 ? getDate() : undefined,
    statusAssignedBy: status0 ? user.customId : undefined,
    labels: [],
    taskSprint: undefined,
    taskResolution: undefined,
  };

  const updatedTask = await ctx.data.task.getAndUpdateOneByQuery<ITask>(
    ctx,
    {customId: task.customId},
    taskUpdates
  );
  assertTask(updatedTask);
  return {task: getPublicTaskData(updatedTask)};
};

export default transferTask;
