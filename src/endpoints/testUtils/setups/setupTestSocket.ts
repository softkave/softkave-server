import {getNewId} from '../../../utilities/ids';
import {IBaseContext} from '../../contexts/IBaseContext';
import {TestAppSocket} from '../contexts/TestAppSocket';

export function setupTestSocket(ctx: IBaseContext, userId: string, roomNames: string[]) {
  const sock = new TestAppSocket(getNewId());
  ctx.socketMap.addSocket({userId, socket: sock, isActive: true});
  roomNames.forEach(rm => {
    ctx.socketRooms.addToRoom(rm, sock.id);
  });
  return {sock};
}
