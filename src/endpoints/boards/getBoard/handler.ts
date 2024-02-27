import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {getReadBoardPermQueries} from '../permissionQueries';
import {assertBoard, getPublicBoardData} from '../utils';
import {GetBoardEndpoint} from './types';
import {getBoardJoiSchema} from './validation';

const getBoard: GetBoardEndpoint = async (ctx, d) => {
  const data = validate(d.data, getBoardJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const board = await ctx.data.board.getOneByQuery(ctx, {customId: data.boardId});
  assertBoard(board);

  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: board.workspaceId,
    actionTarget: board,
    ...getReadBoardPermQueries(board),
  });

  return {board: getPublicBoardData(board)};
};

export default getBoard;
