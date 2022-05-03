import { IChat } from "../../../mongo/chat";
import { IRoom, IRoomMemberReadCounter } from "../../../mongo/room";
import makeSingletonFn from "../../../utilities/createSingletonFunc";
import { getDate, methodNotImplemented } from "../../../utilities/fns";
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
        this.rooms[index].members[mIndex].readCounter = getDate(readCounter);
      }

      return this.rooms[index];
    }
  };

  public insertRoom = async (ctx: IBaseContext, room: IRoom) => {
    this.rooms.push(room);
    return this.rooms[this.rooms.length - 1];
  };

  public insertMessage = async (ctx: IBaseContext, chat: IChat) => {
    this.chats.push(chat);
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

  getRoomByRecipientId = async (
    ctx: IBaseContext,
    orgId: string,
    recipientId: string
  ) => methodNotImplemented();
  getRoomChatsCount = (ctx: IBaseContext, roomId: string, fromDate?: Date) =>
    methodNotImplemented();
  getRoomsByIds = (ctx: IBaseContext, orgId: string, roomIds: string[]) =>
    methodNotImplemented();
  updateRoom = (ctx: IBaseContext, roomId: string, data: Partial<IRoom>) =>
    methodNotImplemented();
}

export const getTestChatContext = makeSingletonFn(() => new TestChatContext());
