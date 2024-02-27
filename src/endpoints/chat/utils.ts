import {IChat} from '../../mongo/chat/definitions';
import {IChatRoom} from '../../mongo/room/definitions';
import {IUnseenChats} from '../../mongo/unseen-chats/definitions';
import {IUser} from '../../mongo/user/definitions';
import {getDateString, getDateStringIfExists} from '../../utilities/fns';
import {IBaseContext} from '../contexts/IBaseContext';
import {getCheckAuthorizationChecker} from '../contexts/authorization-checks/checkAuthorizaton';
import {NotFoundError, PermissionDeniedError} from '../errors';
import {extractFields, getFields, publicWorkspaceResourceFields} from '../utils';
import {getCreateChatPermQueries} from './permissionQueries';
import {IPublicChat, IPublicChatRoom} from './types';

const publicRoomFields = getFields<IPublicChatRoom>({
  ...publicWorkspaceResourceFields,
  name: true,
  members: {
    userId: true,
    readCounter: getDateString,
  },
  lastChatCreatedAt: getDateStringIfExists,
});

const publicChatFields = getFields<IPublicChat>({
  ...publicWorkspaceResourceFields,
  localId: true,
  message: true,
  roomId: true,
});

export function getPublicRoomData(room: IChatRoom): IPublicChatRoom {
  return extractFields(room, publicRoomFields);
}

export function getPublicChatData(chat: IChat): IPublicChat {
  return extractFields(chat, publicChatFields);
}

export function getPublicRoomsArray(rooms: IChatRoom[]): IPublicChatRoom[] {
  return rooms.map(room => extractFields(room, publicRoomFields));
}

export function getPublicChatsArray(chats: IChat[]): IPublicChat[] {
  return chats.map(chat => extractFields(chat, publicChatFields));
}

export function sumUnseenChatsAndRooms(data: IUnseenChats) {
  let roomsCount = 0;
  let chatsCount = 0;
  for (const roomId in data.rooms) {
    const roomChatsCount = data.rooms[roomId] || 0;
    roomsCount += 1;
    chatsCount += roomChatsCount;
  }

  return {roomsCount, chatsCount};
}

export function isUserPartOfRoom(room: IChatRoom, userId: string) {
  return room.members.some(member => member.userId === userId);
}

export function assertChatRoom(rm?: IChatRoom | null): asserts rm {
  if (!rm) {
    throw new NotFoundError('Chat room not found');
  }
}

export async function getChatRoomAndCheckAccess(ctx: IBaseContext, user: IUser, roomId: string) {
  const room = await ctx.chat.getRoomById(ctx, roomId);
  assertChatRoom(room);
  const checker = await getCheckAuthorizationChecker({
    ctx,
    user,
    orgId: room.workspaceId,
    actionTarget: room,
    ...getCreateChatPermQueries(room.workspaceId),
  });

  if (!isUserPartOfRoom(room, user.customId)) {
    throw new PermissionDeniedError();
  }

  return {checker, room};
}
