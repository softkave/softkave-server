import {ITask} from '../../../mongo/block/task';
import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getReadBoardPermQueries} from '../permissionQueries';
import {assertBoard} from '../utils';
import {GetAverageTimeToCompleteTasksEndpoint} from './types';
import {getAverageTimeToCompleteTasksJoiSchema} from './validation';

const getAverageTimeToCompleteTasks: GetAverageTimeToCompleteTasksEndpoint = async (ctx, d) => {
  const data = validate(d.data, getAverageTimeToCompleteTasksJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const board = await ctx.data.board.getOneByQuery(ctx, {customId: data.boardId});
  assertBoard(board);
  await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: board.workspaceId,
    actionTarget: board,
    ...getReadBoardPermQueries(board),
  });

  const statuses = board.boardStatuses || [];
  if (statuses.length === 0) {
    return {avg: 0};
  }

  const lastStatus = statuses[statuses.length - 1];

  // TODO: batch process computation
  const tasks = await ctx.data.task.getManyByQuery<Pick<ITask, 'createdAt' | 'statusAssignedAt'>>(
    ctx,
    {
      customId: board.customId,
      status: lastStatus.customId,
    },
    {projection: {createdAt: 1, statusAssignedAt: 1}}
  );

  if (tasks.length === 0) {
    return {avg: 0};
  }

  const count = tasks.length;
  const totalTime = tasks.reduce((total, item) => {
    if (!item.statusAssignedAt) {
      return total;
    }

    const createdAt = new Date(item.createdAt).valueOf();
    const statusAssignedAt = new Date(item.statusAssignedAt).valueOf();
    return total + (statusAssignedAt - createdAt);
  }, 0);

  const avg = totalTime / count;
  return {avg};
};

export default getAverageTimeToCompleteTasks;
