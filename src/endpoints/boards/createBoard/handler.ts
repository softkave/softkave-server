import {SystemActionType, SystemResourceType} from '../../../models/system';
import {IBoard} from '../../../mongo/block/board';
import {getDate} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {assertOrganization} from '../../organizations/utils';
import {getAssignPermissionPermQueries} from '../../permissions/permissionQueries';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {BoardExistsError} from '../errors';
import {getCreateBoardPermQueries} from '../permissionQueries';
import {getPublicBoardData} from '../utils';
import {CreateBoardEndpoint} from './types';
import {addBoardJoiSchema} from './validation';

const createBoard: CreateBoardEndpoint = async (ctx, d) => {
  const data = validate(d.data, addBoardJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const org = await ctx.data.workspace.getOneByQuery(ctx, {customId: data.board.workspaceId});
  assertOrganization(org);

  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: data.board.workspaceId,
    ...getCreateBoardPermQueries(data.board.workspaceId),
  });

  if (data.board.visibility) {
    const accessChecker = await getCheckAuthorizationChecker({
      ctx,
      user,
      orgId: data.board.workspaceId,
      ...getAssignPermissionPermQueries(data.board.workspaceId, {
        containerId: data.board.workspaceId,
        containerType: SystemResourceType.Workspace,
      }),
    });
  }

  const boardExists = await ctx.data.board.existsByQuery(ctx, {
    name: {$regex: new RegExp(`^${data.board.name}$`, 'i')},
    workspaceId: data.board.workspaceId,
  });

  if (boardExists) {
    throw new BoardExistsError();
  }

  const board: IBoard = {
    customId: getNewId02(SystemResourceType.Board),
    createdBy: user.customId,
    createdAt: getDate(),
    name: data.board.name,
    description: data.board.description,
    workspaceId: data.board.workspaceId,
    color: data.board.color,
    boardStatuses: data.board.boardStatuses.map(item => ({
      ...item,
      createdAt: getDate(),
      createdBy: user.customId,
    })),
    boardLabels: data.board.boardLabels.map(item => ({
      ...item,
      createdAt: getDate(),
      createdBy: user.customId,
    })),
    boardResolutions: data.board.boardResolutions.map(item => ({
      ...item,
      createdAt: getDate(),
      createdBy: user.customId,
    })),
    visibility: data.board.visibility ?? 'organization',
  };

  await ctx.data.board.insertList(ctx, [board]);
  const boardData = getPublicBoardData(board);
  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getOrganizationRoomName(board.workspaceId), {
    actionType: SystemActionType.Create,
    resourceType: SystemResourceType.Board,
    resource: boardData,
  });

  return {
    board: boardData,
  };
};

export default createBoard;
