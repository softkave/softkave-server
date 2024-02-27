import {merge, omit} from 'lodash';
import {SystemActionType, SystemResourceType} from '../../../models/system';
import {IBoard} from '../../../mongo/block/board';
import {ISprint} from '../../../mongo/sprint/definitions';
import {getDate} from '../../../utilities/fns';
import {validate} from '../../../utilities/joiUtils';
import {assertBoard, getPublicBoardData} from '../../boards/utils';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {
  CannotRestartCurrentOrPastSprintsError,
  CannotStartSprintCauseCurrentSprintExistsError,
  SprintDoesNotExistError,
} from '../errors';
import {getUpdateSprintPermQueries} from '../permissionQueries';
import {assertSprint, getPublicSprintData} from '../utils';
import {UpdateSprintEndpoint} from './types';
import {updateSprintJoiSchema} from './validation';

const updateSprint: UpdateSprintEndpoint = async (ctx, d) => {
  const data = validate(d.data, updateSprintJoiSchema);
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
    ...getUpdateSprintPermQueries(board, sprint.customId),
  });

  let updatedSprint: ISprint | null = null;
  let updatedBoard: IBoard | null = null;
  const sprintUpdates: Partial<ISprint> = {
    ...omit(data.data, 'startDate', 'endDate'),
    lastUpdatedAt: getDate(),
    lastUpdatedBy: user.customId,
  };

  if (data.data.startDate) {
    if (board.currentSprintId) {
      throw new CannotStartSprintCauseCurrentSprintExistsError();
    }

    if (sprint.endDate) {
      throw new CannotRestartCurrentOrPastSprintsError();
    }

    merge(sprintUpdates, {startDate: getDate(), startedBy: user.customId});
    updatedSprint = await ctx.sprint.updateSprintById(ctx, sprint.customId, sprintUpdates);
    updatedBoard = await ctx.data.board.getAndUpdateOneByQuery(
      ctx,
      {customId: board.customId},
      {currentSprintId: sprint.customId}
    );
  } else if (data.data.endDate) {
    const statusList = board.boardStatuses || [];
    const endDate = getDate();
    merge(sprintUpdates, {endDate, endedBy: user.customId});
    updatedSprint = await ctx.sprint.updateSprintById(ctx, sprint.customId, sprintUpdates);

    // TODO: how do we update clients with task update?
    // move incomplete tasks to the next sprint
    await ctx.data.task.updateManyByQuery(
      ctx,
      {
        taskSprint: {$objMatch: {sprintId: sprint.customId}},

        // move only incomplete tasks
        status: {$in: statusList.slice(-1).map(s => s.customId)},
      },
      {
        lastUpdatedAt: getDate(),
        lastUpdatedBy: user.customId,
        taskSprint: sprint.nextSprintId
          ? {
              sprintId: sprint.nextSprintId,
              assignedAt: endDate,
              assignedBy: user.customId,
            }
          : null,
      }
    );

    updatedBoard = await ctx.data.board.getAndUpdateOneByQuery(
      ctx,
      {customId: board.customId},
      {currentSprintId: null}
    );
  } else {
    updatedSprint = await ctx.sprint.updateSprintById(ctx, sprint.customId, sprintUpdates);
  }

  assertSprint(updatedSprint);
  const sprintData = getPublicSprintData(updatedSprint);
  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getBoardRoomName(board.customId), {
    actionType: SystemActionType.Update,
    resourceType: SystemResourceType.Sprint,
    resource: sprintData,
  });

  if (updatedBoard) {
    outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getBoardRoomName(board.customId), {
      actionType: SystemActionType.Update,
      resourceType: SystemResourceType.Board,
      resource: getPublicBoardData(updatedBoard),
    });
  }

  return {sprint: sprintData};
};

export default updateSprint;
