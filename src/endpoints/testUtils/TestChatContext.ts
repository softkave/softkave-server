import { IChat } from "../../mongo/chat";
import { IRoom, IRoomMemberReadCounter } from "../../mongo/room";
import getSingletonFunc from "../../utilities/createSingletonFunc";
import { getDate } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { IBaseContext } from "../contexts/BaseContext";
import { IChatContext } from "../contexts/ChatContext";

const chats: IChat[] = [];
const rooms: IRoom[] = [];

class TestChatContext implements IChatContext {
    public getMessages = async (ctx: IBaseContext, roomIds: string[]) => {
        return chats.filter((chat) => roomIds.includes(chat.roomId));
    };

    public getRooms = async (
        ctx: IBaseContext,
        userId: string,
        organizationIds: string[]
    ) => {
        return rooms.filter(
            (room) =>
                room.members.find((member) => member.userId === userId) &&
                organizationIds.includes(room.organizationId)
        );
    };

    public getRoomById = async (ctx: IBaseContext, roomId: string) => {
        return rooms.find((room) => room.customId === roomId);
    };

    public addMemberToRoom = async (
        ctx: IBaseContext,
        roomId: string,
        userId: string
    ) => {
        const index = rooms.findIndex((room) => room.customId === roomId);

        if (index !== -1) {
            rooms[index].members.push({
                userId,
                readCounter: getDate(),
            });
        }
    };

    public updateMemberReadCounter = async (
        ctx: IBaseContext,
        roomId: string,
        userId: string,
        readCounter: Date | string
    ) => {
        const index = rooms.findIndex((room) => room.customId === roomId);

        if (index !== -1) {
            const mIndex = rooms[index].members.findIndex(
                (member) => member.userId === userId
            );

            if (mIndex !== -1) {
                rooms[index].members[mIndex].readCounter = getDate(readCounter);
            }
        }
    };

    public insertRoom = async (
        ctx: IBaseContext,
        organizationId: string,
        userId: string,
        name: string | null,
        initialMembers?: string[]
    ) => {
        const members: IRoomMemberReadCounter[] = [userId]
            .concat(initialMembers)
            .map((id) => ({ userId: id, readCounter: getDate() }));

        const roomId = getNewId();
        const roomName = name || ctx.room.getChatRoomName(roomId);
        rooms.push({
            organizationId,
            members,
            customId: roomId,
            name: roomName,
            createdAt: getDate(),
            createdBy: userId,
        });

        return rooms[rooms.length - 1];
    };

    public insertMessage = async (
        ctx: IBaseContext,
        organizationId: string,
        senderId: string,
        roomId: string,
        message: string
    ) => {
        chats.push({
            customId: getNewId(),
            organizationId,
            message,
            roomId,
            sender: senderId,
            createdAt: getDate(),
        });

        return chats[chats.length - 1];
    };

    public getUserRoomReadCounter = async (
        ctx: IBaseContext,
        userId: string,
        roomId: string
    ) => {
        const index = rooms.findIndex((room) => room.customId === roomId);

        if (index !== -1) {
            const mIndex = rooms[index].members.findIndex(
                (member) => member.userId === userId
            );

            if (mIndex !== -1) {
                return rooms[index].members[mIndex];
            }
        }
    };
}

export const getTestChatContext = getSingletonFunc(() => new TestChatContext());
