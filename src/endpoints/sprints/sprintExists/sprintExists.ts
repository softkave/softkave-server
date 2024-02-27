import {validate} from '../../../utilities/joiUtils';
import {assertBoard} from '../../boards/utils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getReadSprintsPermQueries} from '../permissionQueries';
import {SprintExistsEndpoint} from './types';
import {sprintExistsJoiSchema} from './validation';

const sprintExists: SprintExistsEndpoint = async (ctx, d) => {
  const data = validate(d.data, sprintExistsJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const board = await ctx.data.board.getOneByQuery(ctx, {customId: data.boardId});
  assertBoard(board);
  await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: board.workspaceId,
    actionTarget: board,
    ...getReadSprintsPermQueries(board),
  });

  const doesSprintExist = await ctx.sprint.sprintExists(ctx, data.name, data.boardId);
  return {exists: doesSprintExist};
};

export default sprintExists;
