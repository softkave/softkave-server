import { IChat } from "../../mongo/chat";
import { IRoom } from "../../mongo/room";
import { IUnseenChats } from "../../mongo/unseen-chats";
import { getDateStringIfExists } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { IPublicChatData, IPublicRoomData } from "./types";

const publicRoomFields = getFields<IPublicRoomData>({
  customId: true,
  name: true,
  orgId: true,
  createdAt: getDateStringIfExists,
  createdBy: true,
  members: {
    userId: true,
    readCounter: getDateStringIfExists,
  },
  updatedBy: true,
  updatedAt: getDateStringIfExists,
  lastChatCreatedAt: getDateStringIfExists,
});

const publicChatFields = getFields<IPublicChatData>({
  customId: true,
  localId: true,
  orgId: true,
  message: true,
  sender: true,
  roomId: true,
  createdAt: getDateStringIfExists,
  updatedAt: getDateStringIfExists,
});

export function getPublicRoomData(room: IRoom): IPublicRoomData {
  return extractFields(room, publicRoomFields);
}

export function getPublicChatData(chat: IChat): IPublicChatData {
  return extractFields(chat, publicChatFields);
}

export function getPublicRoomsArray(rooms: IRoom[]): IPublicRoomData[] {
  return rooms.map((room) => extractFields(room, publicRoomFields));
}

export function getPublicChatsArray(chats: IChat[]): IPublicChatData[] {
  return chats.map((chat) => extractFields(chat, publicChatFields));
}

export function sumUnseenChatsAndRooms(data: IUnseenChats) {
  let roomsCount = 0;
  let chatsCount = 0;

  for (let roomId in data.rooms) {
    const roomChatsCount = data.rooms[roomId] || 0;
    roomsCount += 1;
    chatsCount += roomChatsCount;
  }

  return { roomsCount, chatsCount };
}

export function isUserPartOfRoom(room: IRoom, userId: string) {
  return room.members.some((member) => member.userId === userId);
}
