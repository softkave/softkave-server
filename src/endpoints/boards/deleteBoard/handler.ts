import {SystemActionType, SystemResourceType} from '../../../models/system';
import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {fireAndForgetPromise} from '../../utils';
import {getDeleteBoardPermQueries} from '../permissionQueries';
import {assertBoard} from '../utils';
import {DeleteBoardEndpoint} from './types';
import {deleteBoardJoiSchema} from './validation';

const deleteBoard: DeleteBoardEndpoint = async (ctx, d) => {
  const data = validate(d.data, deleteBoardJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const board = await ctx.data.board.getOneByQuery(ctx, {customId: data.boardId});
  assertBoard(board);

  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: board.workspaceId,
    actionTarget: board,
    ...getDeleteBoardPermQueries(board),
  });

  await ctx.data.board.deleteManyByQuery(ctx, {customId: board.customId});
  fireAndForgetPromise(ctx.sprint.deleteSprintByBoardId(ctx, board.customId));
  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getBoardRoomName(board.workspaceId), {
    actionType: SystemActionType.Delete,
    resourceType: SystemResourceType.Board,
    resource: {customId: board.customId},
  });
};

export default deleteBoard;
