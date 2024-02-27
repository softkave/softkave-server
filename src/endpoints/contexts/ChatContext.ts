import {IChat} from '../../mongo/chat/definitions';
import {IChatRoom, IChatRoomMemberReadCounter} from '../../mongo/room/definitions';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {getDate} from '../../utilities/fns';
import {IBaseContext} from './IBaseContext';

export interface IChatContext {
  getMessages: (ctx: IBaseContext, roomIds: string[]) => Promise<IChat[]>;
  getRoomChatsCount: (ctx: IBaseContext, roomId: string, fromDate?: Date) => Promise<number>;
  getRooms: (ctx: IBaseContext, userId: string, organizationIds: string[]) => Promise<IChatRoom[]>;
  getRoomById: (ctx: IBaseContext, roomId: string) => Promise<IChatRoom | null>;
  getRoomsByIds: (ctx: IBaseContext, orgId: string, roomIds: string[]) => Promise<IChatRoom[]>;
  getRoomByRecipientId: (
    ctx: IBaseContext,
    orgId: string,
    recipientId: string
  ) => Promise<IChatRoom | null>;
  addMemberToRoom: (ctx: IBaseContext, roomId: string, userId: string) => Promise<void>;
  updateMemberReadCounter: (
    ctx: IBaseContext,
    roomId: string,
    userId: string,
    readCounter?: Date | string
  ) => Promise<IChatRoom | null>;
  updateRoom: (
    ctx: IBaseContext,
    roomId: string,
    data: Partial<IChatRoom>
  ) => Promise<IChatRoom | null>;
  insertMessage: (ctx: IBaseContext, chat: IChat) => Promise<IChat>;
  insertRoom: (ctx: IBaseContext, room: IChatRoom) => Promise<IChatRoom>;
  getUserRoomReadCounter: (
    ctx: IBaseContext,
    userId: string,
    roomId: string
  ) => Promise<IChatRoomMemberReadCounter | null>;
}

export default class ChatContext implements IChatContext {
  getMessages = async (ctx: IBaseContext, roomIds: string[]) => {
    return ctx.models.chat.model
      .find({
        roomId: {$in: roomIds},
      })
      .lean()
      .exec();
  };

  getRoomChatsCount = async (ctx: IBaseContext, roomId: string, fromDate?: Date) => {
    return ctx.models.chat.model
      .countDocuments({
        roomId,
        createdAt: fromDate ? {$gte: fromDate} : null,
      })
      .exec();
  };

  getRooms = async (ctx: IBaseContext, userId: string, organizationIds: string[]) => {
    return ctx.models.chatRoom.model
      .find({
        orgId: {$in: organizationIds},
        members: {$elemMatch: {userId}},
      })
      .lean()
      .exec();
  };

  getRoomById = async (ctx: IBaseContext, roomId: string) => {
    return ctx.models.chatRoom.model
      .findOne({
        customId: roomId,
      })
      .lean()
      .exec();
  };

  getRoomsByIds = async (ctx: IBaseContext, orgId: string, roomIds: string[]) => {
    return ctx.models.chatRoom.model
      .find({
        orgId,
        customId: {$in: roomIds},
      })
      .lean()
      .exec();
  };

  getRoomByRecipientId = async (ctx: IBaseContext, orgId: string, recipientId: string) => {
    return ctx.models.chatRoom.model
      .findOne({
        orgId,
        'members.userId': recipientId,
      })
      .lean()
      .exec();
  };

  addMemberToRoom = async (ctx: IBaseContext, roomId: string, userId: string) => {
    await ctx.models.chatRoom.model
      .updateOne(
        {customId: roomId},
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
  };

  updateMemberReadCounter = async (
    ctx: IBaseContext,
    roomId: string,
    userId: string,
    readCounter?: Date | string
  ) => {
    return await ctx.models.chatRoom.model
      .findOneAndUpdate(
        {
          customId: roomId,
          members: {$elemMatch: {userId}},
        },
        {
          $set: {
            'members.$.readCounter': getDate(readCounter),
          },
        },
        {new: true, lean: true}
      )
      .exec();
  };

  updateRoom = async (ctx: IBaseContext, roomId: string, data: Partial<IChatRoom>) => {
    return await ctx.models.chatRoom.model
      .findOneAndUpdate({customId: roomId}, data, {
        new: true,
        lean: true,
      })
      .exec();
  };

  insertRoom = async (ctx: IBaseContext, room: IChatRoom) => {
    const newRoom = new ctx.models.chatRoom.model(room);
    await newRoom.save();
    return newRoom;
  };

  insertMessage = async (ctx: IBaseContext, chat: IChat) => {
    const newMessage = new ctx.models.chat.model(chat);
    await newMessage.save();
    return newMessage;
  };

  getUserRoomReadCounter = async (ctx: IBaseContext, userId: string, roomId: string) => {
    const room = await ctx.models.chatRoom.model
      .findOne(
        {
          customId: roomId,
          'members.userId': userId,
        },
        {'members.$': 1}
        // { members: { $elemMatch: { userId } } }
      )
      .lean()
      .exec();

    if (room) {
      return room.members[0];
    }

    return null;
  };
}

export const getChatContext = makeSingletonFn(() => new ChatContext());
