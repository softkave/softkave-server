import { IChat } from "../../mongo/chat";
import { IRoom, IRoomMemberReadCounter } from "../../mongo/room";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getDate } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { saveNewItemToDb, wrapFireAndThrowErrorAsync } from "../utils";
import { IBaseContext } from "./IBaseContext";
import SocketRoomNameHelpers from "./SocketRoomNameHelpers";

export interface IChatContext {
  getMessages: (ctx: IBaseContext, roomIds: string[]) => Promise<IChat[]>;
  getRoomChatsCount: (
    ctx: IBaseContext,
    roomId: string,
    fromDate?: Date
  ) => Promise<number>;
  getRooms: (
    ctx: IBaseContext,
    userId: string,
    organizationIds: string[]
  ) => Promise<IRoom[]>;
  getRoomById: (
    ctx: IBaseContext,
    roomId: string
  ) => Promise<IRoom | undefined>;
  getRoomsByIds: (
    ctx: IBaseContext,
    orgId: string,
    roomIds: string[]
  ) => Promise<IRoom[]>;
  getRoomByRecipientId: (
    ctx: IBaseContext,
    orgId: string,
    recipientId: string
  ) => Promise<IRoom | undefined>;
  addMemberToRoom: (
    ctx: IBaseContext,
    roomId: string,
    userId: string
  ) => Promise<void>;
  updateMemberReadCounter: (
    ctx: IBaseContext,
    roomId: string,
    userId: string,
    readCounter?: Date | string
  ) => Promise<IRoom>;
  updateRoom: (
    ctx: IBaseContext,
    roomId: string,
    data: Partial<IRoom>
  ) => Promise<IRoom>;
  insertMessage: (
    ctx: IBaseContext,
    organizationId: string,
    senderId: string,
    roomId: string,
    message: string
  ) => Promise<IChat>;
  insertRoom: (
    ctx: IBaseContext,
    organizationId: string,
    userId: string,
    name: string,
    otherMembers?: string[]
  ) => Promise<IRoom>;
  getUserRoomReadCounter: (
    ctx: IBaseContext,
    userId: string,
    roomId: string
  ) => Promise<IRoomMemberReadCounter | undefined>;
}

export default class ChatContext implements IChatContext {
  public getMessages = wrapFireAndThrowErrorAsync(
    async (ctx: IBaseContext, roomIds: string[]) => {
      return ctx.models.chatModel.model
        .find({
          roomId: { $in: roomIds },
        })
        .lean()
        .exec();
    }
  );

  public getRoomChatsCount = wrapFireAndThrowErrorAsync(
    async (ctx: IBaseContext, roomId: string, fromDate?: Date) => {
      return ctx.models.chatModel.model
        .countDocuments({
          roomId,
          createdAt: fromDate ? { $gte: fromDate } : undefined,
        })
        .exec();
    }
  );

  public getRooms = wrapFireAndThrowErrorAsync(
    async (ctx: IBaseContext, userId: string, organizationIds: string[]) => {
      return ctx.models.roomModel.model
        .find({
          orgId: { $in: organizationIds },
          members: { $elemMatch: { userId } },
        })
        .lean()
        .exec();
    }
  );

  public getRoomById = wrapFireAndThrowErrorAsync(
    async (ctx: IBaseContext, roomId: string) => {
      return ctx.models.roomModel.model
        .findOne({
          customId: roomId,
        })
        .lean()
        .exec();
    }
  );

  public getRoomsByIds = wrapFireAndThrowErrorAsync(
    async (ctx: IBaseContext, orgId: string, roomIds: string[]) => {
      return ctx.models.roomModel.model
        .find({
          orgId,
          customId: { $in: roomIds },
        })
        .lean()
        .exec();
    }
  );

  public getRoomByRecipientId = wrapFireAndThrowErrorAsync(
    async (ctx: IBaseContext, orgId: string, recipientId: string) => {
      return ctx.models.roomModel.model
        .findOne({
          orgId,
          "members.userId": recipientId,
        })
        .lean()
        .exec();
    }
  );

  public addMemberToRoom = wrapFireAndThrowErrorAsync(
    async (ctx: IBaseContext, roomId: string, userId: string) => {
      await ctx.models.roomModel.model
        .updateOne(
          { customId: roomId },
          {
            $push: {
              members: {
                userId,
                readCounter: getDate(),
              },
            },
          }
        )
        .exec();
    }
  );

  public updateMemberReadCounter = wrapFireAndThrowErrorAsync(
    async (
      ctx: IBaseContext,
      roomId: string,
      userId: string,
      readCounter: Date | string
    ) => {
      return await ctx.models.roomModel.model
        .findOneAndUpdate(
          {
            customId: roomId,
            members: { $elemMatch: { userId } },
          },
          {
            $set: {
              "members.$.readCounter": getDate(readCounter),
            },
          },
          { new: true, lean: true }
        )
        .exec();
    }
  );

  public updateRoom = wrapFireAndThrowErrorAsync(
    async (ctx: IBaseContext, roomId: string, data: Partial<IRoom>) => {
      return await ctx.models.roomModel.model
        .findOneAndUpdate({ customId: roomId }, data, {
          new: true,
          lean: true,
        })
        .exec();
    }
  );

  public insertRoom = wrapFireAndThrowErrorAsync(
    async (
      ctx: IBaseContext,
      organizationId: string,
      userId: string,
      name: string | null,
      otherMembers?: string[]
    ) => {
      const members: IRoomMemberReadCounter[] = [userId]
        .concat(otherMembers)
        .map((id) => ({ userId: id, readCounter: getDate() }));

      return saveNewItemToDb(async () => {
        const roomId = getNewId();
        const roomName = name || SocketRoomNameHelpers.getChatRoomName(roomId);
        const newRoom = new ctx.models.roomModel.model({
          organizationId,
          members,
          customId: roomId,
          name: roomName,
          createdAt: getDate(),
          createdBy: userId,
        });

        await newRoom.save();
        return newRoom;
      });
    }
  );

  public insertMessage = wrapFireAndThrowErrorAsync(
    async (
      ctx: IBaseContext,
      organizationId: string,
      senderId: string,
      roomId: string,
      message: string
    ) => {
      return saveNewItemToDb(async () => {
        const newMessage = new ctx.models.chatModel.model({
          customId: getNewId(),
          organizationId,
          message,
          roomId,
          sender: senderId,
          createdAt: getDate(),
        });

        await newMessage.save();
        return newMessage;
      });
    }
  );

  public getUserRoomReadCounter = wrapFireAndThrowErrorAsync(
    async (ctx: IBaseContext, userId: string, roomId: string) => {
      const room = await ctx.models.roomModel.model
        .findOne(
          {
            customId: roomId,
            "members.userId": userId,
          },
          { "members.$": 1 }
          // { members: { $elemMatch: { userId } } }
        )
        .lean()
        .exec();

      if (room) {
        return room.members[0];
      }
    }
  );
}

export const getChatContext = makeSingletonFn(() => new ChatContext());
