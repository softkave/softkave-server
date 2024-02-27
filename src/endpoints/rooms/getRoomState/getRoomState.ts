import {compact} from 'lodash';
import {SystemActionType, SystemResourceType} from '../../../models/system';
import {validate} from '../../../utilities/joiUtils';
import {assertChatRoom} from '../../chat/utils';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {subscribeJoiSchema} from '../subscribe/validation';
import {
  canReadBoardSocketRoom,
  canReadChatSocketRoom,
  canReadOrganizationSocketRoom,
} from '../utils';
import {GetRoomStateEndpoint} from './types';

// TODO: should we audit log these?
const getRoomState: GetRoomStateEndpoint = async (ctx, d) => {
  const data = validate(d.data, subscribeJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const promises = data.rooms.map(async item => {
    switch (item.type) {
      case SystemResourceType.Workspace: {
        await canReadOrganizationSocketRoom(ctx, user, item);
        const roomName = SocketRoomNameHelpers.getOrganizationRoomName(
          item.customId,
          item.action || SystemActionType.Read
        );
        return ctx.socketRooms.getRoom(roomName);
      }

      case SystemResourceType.Board: {
        await canReadBoardSocketRoom(ctx, user, item);
        const boardRoomName = SocketRoomNameHelpers.getBoardRoomName(item.customId);
        if (item.subRoom === SystemResourceType.Task) {
          const roomName = SocketRoomNameHelpers.getBoardTasksRoomName(item.customId);
          return ctx.socketRooms.getRoom(roomName);
        } else if (item.subRoom === SystemResourceType.Sprint) {
          const roomName = SocketRoomNameHelpers.getBoardSprintsRoomName(item.customId);
          return ctx.socketRooms.getRoom(roomName);
        }
        return ctx.socketRooms.getRoom(boardRoomName);
      }

      case SystemResourceType.ChatRoom: {
        await canReadChatSocketRoom(ctx, user, item);
        const room = await ctx.chat.getRoomById(ctx, item.customId);
        assertChatRoom(room);
        return ctx.socketRooms.getRoom(SocketRoomNameHelpers.getChatRoomName(room.customId));
      }
    }

    return null;
  });

  const rooms = await Promise.all(promises);
  return {rooms: compact(rooms)};
};

export default getRoomState;
