import { IChat } from "../../../mongo/chat";
import { IRoom, IRoomMemberReadCounter } from "../../../mongo/room";
import makeSingletonFn from "../../../utilities/createSingletonFunc";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { IChatContext } from "../../contexts/ChatContext";
import { IBaseContext } from "../../contexts/IBaseContext";

class TestChatContext implements IChatContext {
    chats: IChat[] = [];
    rooms: IRoom[] = [];

    public getMessages = async (ctx: IBaseContext, roomIds: string[]) => {
        return this.chats.filter((chat) => roomIds.includes(chat.roomId));
    };

    public getRooms = async (
        ctx: IBaseContext,
        userId: string,
        organizationIds: string[]
    ) => {
        return this.rooms.filter(
            (room) =>
                room.members.find((member) => member.userId === userId) &&
                organizationIds.includes(room.orgId)
        );
    };

    public getRoomById = async (ctx: IBaseContext, roomId: string) => {
        return this.rooms.find((room) => room.customId === roomId);
    };

    public addMemberToRoom = async (
        ctx: IBaseContext,
        roomId: string,
        userId: string
    ) => {
        const index = this.rooms.findIndex((room) => room.customId === roomId);

        if (index !== -1) {
            this.rooms[index].members.push({
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
        const index = this.rooms.findIndex((room) => room.customId === roomId);

        if (index !== -1) {
            const mIndex = this.rooms[index].members.findIndex(
                (member) => member.userId === userId
            );

            if (mIndex !== -1) {
                this.rooms[index].members[mIndex].readCounter =
                    getDate(readCounter);
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
        this.rooms.push({
            orgId: organizationId,
            members,
            customId: roomId,
            name: roomName,
            createdAt: getDate(),
            createdBy: userId,
        });

        return this.rooms[this.rooms.length - 1];
    };

    public insertMessage = async (
        ctx: IBaseContext,
        organizationId: string,
        senderId: string,
        roomId: string,
        message: string
    ) => {
        this.chats.push({
            customId: getNewId(),
            orgId: organizationId,
            message,
            roomId,
            sender: senderId,
            createdAt: getDate(),
        });

        return this.chats[this.chats.length - 1];
    };

    public getUserRoomReadCounter = async (
        ctx: IBaseContext,
        userId: string,
        roomId: string
    ) => {
        const index = this.rooms.findIndex((room) => room.customId === roomId);

        if (index !== -1) {
            const mIndex = this.rooms[index].members.findIndex(
                (member) => member.userId === userId
            );

            if (mIndex !== -1) {
                return this.rooms[index].members[mIndex];
            }
        }
    };
}

export const getTestChatContext = makeSingletonFn(() => new TestChatContext());
