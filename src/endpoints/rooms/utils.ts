import {IUser} from '../../mongo/user/definitions';
import {getReadBoardPermQueries} from '../boards/permissionQueries';
import {assertBoard} from '../boards/utils';
import {getChatRoomAndCheckAccess} from '../chat/utils';
import {getCheckAuthorizationChecker} from '../contexts/authorization-checks/checkAuthorizaton';
import {IBaseContext} from '../contexts/IBaseContext';
import {getReadOrgPermQueries} from '../organizations/permissionQueries';
import {assertOrganization} from '../organizations/utils';
import {IRoomOpInput} from './types';

export async function canReadOrganizationSocketRoom(
  ctx: IBaseContext,
  user: IUser,
  item: IRoomOpInput
) {
  const org = await ctx.data.workspace.getOneByQuery(ctx, {customId: item.customId});
  assertOrganization(org);
  const checker = await getCheckAuthorizationChecker({
    user: user,
    ctx: ctx,
    orgId: org.customId,
    ...getReadOrgPermQueries(org.customId),
  });
  checker.checkActionTarget(org);
  return {checker, org};
}

export async function canReadBoardSocketRoom(ctx: IBaseContext, user: IUser, item: IRoomOpInput) {
  const board = await ctx.data.board.getOneByQuery(ctx, {customId: item.customId});
  assertBoard(board);
  const checker = await getCheckAuthorizationChecker({
    user: user,
    ctx: ctx,
    orgId: board.customId,
    ...getReadBoardPermQueries(board),
  });
  checker.checkActionTarget(board);
  return {checker, board};
}

export async function canReadChatSocketRoom(ctx: IBaseContext, user: IUser, item: IRoomOpInput) {
  return await getChatRoomAndCheckAccess(ctx, user, item.customId);
}
