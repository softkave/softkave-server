import {SystemActionType, SystemResourceType} from '../../../models/system';
import {getDate} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {IBaseContext} from '../../contexts/IBaseContext';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {assertOrganization} from '../../organizations/utils';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {getCreateChatPermQueries} from '../permissionQueries';
import {getPublicRoomData} from '../utils';
import {AddRoomEndpoint} from './types';
import {addRoomJoiSchema} from './validation';

const addRoom: AddRoomEndpoint = async (ctx, d) => {
  const data = validate(d.data, addRoomJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const org = await ctx.data.workspace.getOneByQuery(ctx, {customId: data.orgId});
  assertOrganization(org);

  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: data.orgId,
    ...getCreateChatPermQueries(data.orgId),
  });

  let room = await ctx.chat.getRoomByRecipientId(ctx, data.orgId, data.recipientId);
  if (!room) {
    const roomId = getNewId02(SystemResourceType.ChatRoom);
    room = await ctx.chat.insertRoom(ctx, {
      customId: roomId,
      workspaceId: data.orgId,
      members: [
        {
          userId: user.customId,
          readCounter: getDate(),
        },
        {
          userId: data.recipientId,
          readCounter: getDate(),
        },
      ],
      createdAt: getDate(),
      createdBy: user.customId,
      name: SocketRoomNameHelpers.getChatRoomName(roomId),
      visibility: 'organization',
    });

    addUserToRoom(ctx, room.name, user.customId);
    addUserToRoom(ctx, room.name, data.recipientId);
    outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getUserRoomName(data.recipientId), {
      actionType: SystemActionType.Create,
      resourceType: SystemResourceType.ChatRoom,
      resource: getPublicRoomData(room),
    });
  }

  return {room: getPublicRoomData(room)};
};

function addUserToRoom(ctx: IBaseContext, roomName: string, userId: string) {
  const userRoom = ctx.socketRooms.getRoom(SocketRoomNameHelpers.getUserRoomName(userId));
  if (!userRoom) {
    return;
  }

  Object.keys(userRoom.socketIds).forEach(id => ctx.socketRooms.addToRoom(roomName, id));
}

export default addRoom;
