import {SystemActionType, SystemResourceType} from '../../../models/system';
import {IBoard} from '../../../mongo/block/board';
import {ISprint} from '../../../mongo/sprint/definitions';
import {validate} from '../../../utilities/joiUtils';
import {IUpdateItemById} from '../../../utilities/types';
import {assertBoard, getPublicBoardData} from '../../boards/utils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {CannotDeleteCurrentOrPastSprintError, SprintDoesNotExistError} from '../errors';
import {getDeleteSprintPermQueries} from '../permissionQueries';
import {updateTaskSprintsUsingSprintId} from '../utils';
import {DeleteSprintEndpoint} from './types';
import {deleteSprintJoiSchema} from './validation';

const deleteSprint: DeleteSprintEndpoint = async (ctx, d) => {
  const data = validate(d.data, deleteSprintJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const sprint = await ctx.sprint.getSprintById(ctx, data.sprintId);
  if (!sprint) {
    throw new SprintDoesNotExistError();
  }

  const board = await ctx.data.board.getOneByQuery(ctx, {customId: sprint.boardId});
  assertBoard(board);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: board.workspaceId,
    actionTarget: sprint,
    ...getDeleteSprintPermQueries(board, sprint.customId),
  });

  if (sprint.startDate) {
    throw new CannotDeleteCurrentOrPastSprintError();
  }

  await updateTaskSprintsUsingSprintId(ctx, user.customId, sprint.customId, null);

  // TODO: bulk update and delete the sprints or do ops in txn
  await ctx.sprint.deleteSprint(ctx, data.sprintId);
  const bulkSprintUpdates: Array<IUpdateItemById<ISprint>> = [];
  if (sprint.prevSprintId) {
    bulkSprintUpdates.push({
      id: sprint.prevSprintId,
      data: {nextSprintId: sprint.nextSprintId ?? null},
    });
  }

  if (sprint.nextSprintId) {
    bulkSprintUpdates.push({
      id: sprint.nextSprintId,
      data: {prevSprintId: sprint.prevSprintId ?? null},
    });
  }

  await ctx.sprint.bulkUpdateSprintsById(ctx, bulkSprintUpdates);
  const boardUpdates: Partial<IBoard> = {};
  if (sprint.customId === board.lastSprintId) {
    boardUpdates.lastSprintId = sprint.prevSprintId ?? null;
  }

  if (Object.keys(boardUpdates).length > 0) {
    // If has board updates
    const updatedBoard = await ctx.data.board.getAndUpdateOneByQuery(
      ctx,
      {customId: board.customId},
      boardUpdates
    );
    if (updatedBoard) {
      outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getBoardRoomName(board.customId), {
        actionType: SystemActionType.Update,
        resourceType: SystemResourceType.Board,
        resource: getPublicBoardData(updatedBoard),
      });
    }
  }

  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getBoardRoomName(board.customId), {
    actionType: SystemActionType.Delete,
    resourceType: SystemResourceType.Sprint,
    resource: {customId: sprint.customId},
  });
};

export default deleteSprint;
