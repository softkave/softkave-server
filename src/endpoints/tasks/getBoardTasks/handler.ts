import {validate} from '../../../utilities/joiUtils';
import {assertBoard} from '../../boards/utils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getReadTasksPermQueries} from '../permissionQueries';
import {getPublicTasksArray} from '../utils';
import {GetBoardTasksEndpoint} from './types';
import {getBoardTasksJoiSchema} from './validation';

const getBoardTasks: GetBoardTasksEndpoint = async (ctx, d) => {
  const data = validate(d.data, getBoardTasksJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const board = await ctx.data.board.getOneByQuery(ctx, {customId: data.boardId});
  assertBoard(board);

  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: board.workspaceId,
    ...getReadTasksPermQueries(board.customId, board.workspaceId),
  });

  const tasks = await ctx.data.task.getManyByQuery(ctx, {boardId: data.boardId});
  const permittedTasks = tasks.filter(t => {
    const {allow} = accessChecker.checkActionTarget(t);
    return allow;
  });

  return {
    tasks: getPublicTasksArray(permittedTasks),
  };
};

export default getBoardTasks;
