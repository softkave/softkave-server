import {SystemActionType, SystemResourceType} from '../../../models/system';
import {IBoard} from '../../../mongo/block/board';
import {ISprint} from '../../../mongo/sprint/definitions';
import {getDate} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {validate} from '../../../utilities/joiUtils';
import {assertBoard} from '../../boards/utils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {SprintsNotSetupYetError, SprintWithNameExistsError} from '../errors';
import {getCreateSprintPermQueries} from '../permissionQueries';
import {getPublicSprintData} from '../utils';
import {AddSprintEndpoint} from './types';
import {addSprintJoiSchema} from './validation';

const addSprint: AddSprintEndpoint = async (ctx, d) => {
  const data = validate(d.data, addSprintJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const board = await ctx.data.board.getOneByQuery(ctx, {customId: data.boardId});
  assertBoard(board);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: board.workspaceId,
    ...getCreateSprintPermQueries(board),
  });

  if (!board.sprintOptions) {
    throw new SprintsNotSetupYetError();
  }

  const sprintWithNameExists = await ctx.sprint.sprintExists(ctx, data.data.name, data.boardId);
  if (sprintWithNameExists) {
    throw new SprintWithNameExistsError();
  }

  let prevSprint: ISprint | null = null;
  if (board.lastSprintId) {
    prevSprint = await ctx.sprint.getSprintById(ctx, board.lastSprintId);
  }

  let sprint: ISprint = {
    customId: getNewId02(SystemResourceType.Sprint),
    boardId: data.boardId,
    workspaceId: board.workspaceId,
    duration: data.data.duration,
    name: data.data.name,
    createdAt: getDate(),
    createdBy: user.customId,
    prevSprintId: prevSprint?.customId,
    sprintIndex: (prevSprint?.sprintIndex || 0) + 1,
    visibility: board.visibility,
  };

  // TODO: can we bulk update these?
  sprint = await ctx.sprint.saveSprint(ctx, sprint);
  if (board.lastSprintId) {
    await ctx.sprint.updateSprintById(ctx, board.lastSprintId, {nextSprintId: sprint.customId});
  }

  const boardUpdates: Partial<IBoard> = {lastSprintId: sprint.customId};
  await ctx.data.board.updateOneByQuery(ctx, {customId: board.customId}, boardUpdates);
  const publicSprint = getPublicSprintData(sprint);
  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getBoardRoomName(board.customId), {
    actionType: SystemActionType.Create,
    resourceType: SystemResourceType.Sprint,
    resource: publicSprint,
  });

  return {sprint: publicSprint};
};

export default addSprint;
