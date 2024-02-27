import {SystemActionType, SystemResourceType} from '../../../models/system';
import {IBoard} from '../../../mongo/block/board';
import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {getAssignPermissionPermQueries} from '../../permissions/permissionQueries';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {fireAndForgetPromise} from '../../utils';
import {getUpdateBoardPermQueries} from '../permissionQueries';
import {assertBoard, getPublicBoardData} from '../utils';
import persistBoardLabelChanges from './persistBoardLabelChanges';
import persistBoardResolutionsChanges from './persistBoardResolutionsChanges';
import persistBoardStatusChanges from './persistBoardStatusChanges';
import processUpdateBoardInput from './processUpdateBoardInput';
import {UpdateBoardEndpoint} from './types';
import {updateBoardJoiSchema} from './validation';

const updateBoard: UpdateBoardEndpoint = async (ctx, d) => {
  const data = validate(d.data, updateBoardJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const board = await ctx.data.board.getOneByQuery(ctx, {customId: data.boardId});
  assertBoard(board);

  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: board.workspaceId,
    actionTarget: board,
    ...getUpdateBoardPermQueries(board),
  });

  if (data.data.visibility !== undefined) {
    const accessChecker = await getCheckAuthorizationChecker({
      ctx,
      user,
      orgId: board.workspaceId,
      ...getAssignPermissionPermQueries(board.workspaceId, {
        containerId: board.customId,
        containerType: SystemResourceType.Board,
      }),
    });
  }

  const update: Partial<IBoard> = processUpdateBoardInput(board, data.data, user);
  if (update.sprintOptions && update.sprintOptions.duration !== board.sprintOptions?.duration) {
    await ctx.sprint.updateUnstartedSprints(ctx, board.customId, {
      duration: update.sprintOptions.duration,
    });
  }

  const updatedBoard = await ctx.data.board.getAndUpdateOneByQuery(
    ctx,
    {customId: data.boardId},
    update
  );
  assertBoard(updatedBoard);

  // TODO: should we wait for these to complete, cause a user can reload while they're pending
  // and get incomplete/incorrect data
  fireAndForgetPromise(persistBoardStatusChanges(ctx, d, board, update, user));
  fireAndForgetPromise(persistBoardResolutionsChanges(ctx, d, board, update));
  fireAndForgetPromise(persistBoardLabelChanges(ctx, d, board, update));

  const boardData = getPublicBoardData(updatedBoard);
  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getBoardRoomName(board.customId), {
    actionType: SystemActionType.Update,
    resourceType: SystemResourceType.Board,
    resource: boardData,
  });

  return {board: boardData};
};

export default updateBoard;
