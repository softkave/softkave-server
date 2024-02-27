import {SystemResourceType} from '../../../models/system';
import {validate} from '../../../utilities/joiUtils';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {SubscribeEndpoint} from '../subscribe/types';
import {subscribeJoiSchema} from '../subscribe/validation';

// TODO: should we audit log these?
const unsubscribe: SubscribeEndpoint = async (ctx, d) => {
  const data = validate(d.data, subscribeJoiSchema);
  await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const socket = ctx.session.assertGetSocket(d);
  let roomName = '';
  data.rooms.forEach(item => {
    switch (item.type) {
      case SystemResourceType.Workspace: {
        roomName = SocketRoomNameHelpers.getOrganizationRoomName(item.customId);
        break;
      }

      case SystemResourceType.Board: {
        if (item.subRoom === SystemResourceType.Task) {
          roomName = SocketRoomNameHelpers.getBoardTasksRoomName(item.customId);
        } else if (item.subRoom === SystemResourceType.Sprint) {
          roomName = SocketRoomNameHelpers.getBoardSprintsRoomName(item.customId);
        } else {
          roomName = SocketRoomNameHelpers.getBoardRoomName(item.customId);
        }
        break;
      }

      case SystemResourceType.ChatRoom: {
        roomName = SocketRoomNameHelpers.getChatRoomName(item.customId);
        break;
      }
    }

    if (roomName) {
      ctx.socketRooms.removeFromRoom(roomName, socket.id);
    }
  });
};

export default unsubscribe;
