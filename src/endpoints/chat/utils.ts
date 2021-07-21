import { IChat } from "../../mongo/chat";
import { IRoom } from "../../mongo/room";
import { IUnseenChats } from "../../mongo/unseen-chats";
import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { IPublicChatData, IPublicRoomData } from "./types";

const publicRoomFields = getFields<IPublicRoomData>({
    customId: true,
    name: true,
    organizationId: true,
    createdAt: getDateString,
    createdBy: true,
    members: {
        userId: true,
        readCounter: getDateString,
    },
    updatedAt: getDateString,
    updatedBy: true,
});

const publicChatFields = getFields<IPublicChatData>({
    customId: true,
    organizationId: true,
    message: true,
    sender: true,
    roomId: true,
    createdAt: getDateString,
    updatedAt: getDateString,
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
