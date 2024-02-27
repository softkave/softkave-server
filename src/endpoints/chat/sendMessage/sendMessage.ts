import {SystemActionType, SystemResourceType} from '../../../models/system';
import {IChatRoom} from '../../../mongo/room/definitions';
import {IUser} from '../../../mongo/user/definitions';
import {getDate} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {validate} from '../../../utilities/joiUtils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {IBaseContext} from '../../contexts/IBaseContext';
import SocketRoomNameHelpers from '../../contexts/SocketRoomNameHelpers';
import {assertOrganization} from '../../organizations/utils';
import outgoingSocketEventFn from '../../socket/outgoingEventFn';
import {fireAndForgetFn, fireAndForgetPromise} from '../../utils';
import {getCreateChatPermQueries} from '../permissionQueries';
import {
  assertChatRoom,
  getPublicChatData,
  getPublicRoomData,
  sumUnseenChatsAndRooms,
} from '../utils';
import {SendMessageEndpoint} from './type';
import {sendMessageJoiSchema} from './validation';

const sendMessage: SendMessageEndpoint = async (ctx, d) => {
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  ctx.socket.assertSocket(d);
  const data = validate(d.data, sendMessageJoiSchema);
  const organization = await ctx.data.workspace.getOneByQuery(ctx, {workspaceId: data.orgId});
  assertOrganization(organization);
  const accessChecker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: data.orgId,
    ...getCreateChatPermQueries(data.orgId),
  });

  let room = await ctx.chat.getRoomById(ctx, data.roomId);
  assertChatRoom(room);
  const chat = await ctx.chat.insertMessage(ctx, {
    customId: getNewId02(SystemResourceType.Chat),
    createdAt: getDate(),
    createdBy: user.customId,
    message: data.message,
    roomId: room.customId,
    workspaceId: organization.customId,
    visibility: 'private',
  });

  room = await ctx.chat.updateRoom(ctx, room.customId, {
    lastChatCreatedAt: chat.createdAt,
    members: room.members.map(member => {
      if (member.userId === user.customId) {
        return {
          ...member,
          readCounter: getDate(),
        };
      }

      return member;
    }),
    lastUpdatedAt: getDate(),
    lastUpdatedBy: user.customId,
  });

  assertChatRoom(room);
  const roomData = getPublicRoomData(room);
  const chatData = getPublicChatData(chat);
  chatData.localId = data.localId;
  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getChatRoomName(room.customId), {
    actionType: SystemActionType.Update,
    resourceType: SystemResourceType.ChatRoom,
    resource: roomData,
  });

  outgoingSocketEventFn(ctx, SocketRoomNameHelpers.getChatRoomName(room.customId), {
    actionType: SystemActionType.Create,
    resourceType: SystemResourceType.Chat,
    resource: chatData,
  });

  // TODO: implement a scheduler that can run a task after a task is completed
  // TODO: our fire and forget are running immediately
  // go through them and update the ones you want to run
  // after the main request is done
  fireAndForgetFn(() => sendPushNotification(ctx, user, room!));

  return {chat: chatData};
};

async function sendPushNotification(context: IBaseContext, sender: IUser, room: IChatRoom) {
  const members = room.members;
  const socketRoom = context.socketRooms.getRoom(
    SocketRoomNameHelpers.getChatRoomName(room.customId)
  );

  if (!socketRoom) {
    return;
  }

  const activeUsersMap: Record<string, boolean> = {[sender.customId]: true};
  Object.keys(socketRoom.socketIds).forEach(id => {
    const socket = context.socketMap.getSocket(id);

    if (socket && socket.isActive) {
      activeUsersMap[socket.userId] = true;
    }
  });

  const inactiveMemberIds = members
    .filter(member => !activeUsersMap[member.userId])
    .map(member => member.userId);

  inactiveMemberIds.forEach(async userId => {
    // TODO: what happens when the user gets another message in the same room
    // while the current one is processing

    // TODO: maybe only log the unseen chats
    // then lock ( still accept updates but only send the current amount )
    // and send in intervals
    const unseenChats = await context.unseenChats.addEntry(context, userId, room.customId);

    // TODO: chats count is flaky and sometimes, inactiveSockets count is flaky
    const {roomsCount, chatsCount} = sumUnseenChatsAndRooms(unseenChats);
    const clients = await context.client.getPushSubscribedClients(context, userId);

    if (clients.length === 0) {
      return;
    }

    const message = `You have ${chatsCount} ${
      chatsCount === 1 ? 'message' : 'messages'
    } from ${roomsCount} ${roomsCount === 1 ? 'chat' : 'chats'}`;

    clients.forEach(client => {
      const endpoint = client.endpoint!;
      const keys = client.keys!;
      fireAndForgetPromise(context.webPush.sendNotification(context, endpoint, keys, message));
    });
  });
}

export default sendMessage;
