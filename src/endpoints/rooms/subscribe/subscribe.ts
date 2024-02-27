import {SystemActionType, SystemResourceType} from '../../../models/system';
import {validate} from '../../../utilities/joiUtils';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {
  canReadBoardSocketRoom,
  canReadChatSocketRoom,
  canReadOrganizationSocketRoom,
} from '../utils';
import {SubscribeEndpoint} from './types';
import {subscribeJoiSchema} from './validation';

// TODO: should we audit log these?
const subscribe: SubscribeEndpoint = async (ctx, d) => {
  const data = validate(d.data, subscribeJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const socket = ctx.socket.assertGetSocket(d);
  const promises = data.rooms.map(async item => {
    switch (item.type) {
      case SystemResourceType.Workspace: {
        await canReadOrganizationSocketRoom(ctx, user, item);
        const roomName = SocketRoomNameHelpers.getOrganizationRoomName(
          item.customId,
          item.action || SystemActionType.Read
        );
        ctx.socketRooms.addToRoom(roomName, socket.id);
        return;
      }

      case SystemResourceType.Board: {
        await canReadBoardSocketRoom(ctx, user, item);
        const baordRoomName = SocketRoomNameHelpers.getBoardRoomName(item.customId);
        if (item.subRoom === SystemResourceType.Task) {
          const roomName = SocketRoomNameHelpers.getBoardTasksRoomName(item.customId);
          ctx.socketRooms.addToRoom(roomName, socket.id, {
            useSocketIdsFromRoom: baordRoomName,
          });
        } else if (item.subRoom === SystemResourceType.Sprint) {
          const roomName = SocketRoomNameHelpers.getBoardSprintsRoomName(item.customId);
          ctx.socketRooms.addToRoom(roomName, socket.id, {
            useSocketIdsFromRoom: baordRoomName,
          });
        } else {
          ctx.socketRooms.addToRoom(baordRoomName, socket.id);
        }

        return;
      }

      case SystemResourceType.ChatRoom: {
        await canReadChatSocketRoom(ctx, user, item);
        ctx.socketRooms.addToRoom(SocketRoomNameHelpers.getChatRoomName(item.customId), socket.id);
        return;
      }
    }
  });

  // TODO: can we return individual errors, not combined or the first to occur?
  // same for other room endpoints
  await Promise.all(promises);
};

export default subscribe;
