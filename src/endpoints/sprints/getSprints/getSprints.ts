import {validate} from '../../../utilities/joiUtils';
import {assertBoard} from '../../boards/utils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getReadSprintsPermQueries} from '../permissionQueries';

import {getPublicSprintArray} from '../utils';
import {GetSprintsEndpoint} from './types';
import {getSprintsJoiSchema} from './validation';

const getSprints: GetSprintsEndpoint = async (ctx, d) => {
  const data = validate(d.data, getSprintsJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const board = await ctx.data.board.getOneByQuery(ctx, {customId: data.boardId});
  assertBoard(board);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: board.workspaceId,
    ...getReadSprintsPermQueries(board),
  });

  const sprints = await ctx.sprint.getSprintsByBoardId(ctx, board.customId);
  const permittedSprints = sprints.filter(s => {
    const {allow} = accessChecker.checkActionTarget(s);
    return allow;
  });

  return {sprints: getPublicSprintArray(permittedSprints)};
};

export default getSprints;
