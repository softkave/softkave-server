import { IChat } from "../../mongo/chat";
import { IRoom, IRoomMemberReadCounter } from "../../mongo/room";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDate } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import UserToken from "../user/UserToken";
import { saveNewItemToDb, wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface IChatContext {
    getMessages: (ctx: IBaseContext, roomIds: string[]) => Promise<IChat[]>;
    getRooms: (ctx: IBaseContext, userId: string) => Promise<IRoom[]>;
    getRoomById: (
        ctx: IBaseContext,
        roomId: string
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
    ) => Promise<void>;
    insertMessage: (
        ctx: IBaseContext,
        orgId: string,
        senderId: string,
        roomId: string,
        message: string
    ) => Promise<IChat>;
    insertRoom: (
        ctx: IBaseContext,
        orgId: string,
        userId: string,
        name: string,
        initialMembers?: string[]
    ) => Promise<IRoom>;
    getUserRoomReadCounter: (
        ctx: IBaseContext,
        userId: string,
        roomId: string
    ) => Promise<IRoomMemberReadCounter | undefined>;
}

export default class ChatContext implements IChatContext {
    public getMessages = wrapFireAndThrowError(
        async (ctx: IBaseContext, roomIds: string[]) => {
            return ctx.models.chatModel.model
                .find({
                    roomId: { $in: roomIds },
                })
                .lean()
                .exec();
        }
    );

    public getRooms = wrapFireAndThrowError(
        async (ctx: IBaseContext, userId: string) => {
            return ctx.models.roomModel.model
                .find({
                    members: { $elemMatch: { userId } },
                })
                .lean()
                .exec();
        }
    );

    public getRoomById = wrapFireAndThrowError(
        async (ctx: IBaseContext, roomId: string) => {
            return ctx.models.roomModel.model
                .findOne({
                    customId: roomId,
                })
                .lean()
                .exec();
        }
    );

    public addMemberToRoom = wrapFireAndThrowError(
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

    public updateMemberReadCounter = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            roomId: string,
            userId: string,
            readCounter: Date | string
        ) => {
            await ctx.models.roomModel.model
                .updateOne(
                    {
                        customId: roomId,
                        members: { $elemMatch: { userId } },
                    },
                    {
                        $set: {
                            "members.$.readCounter": getDate(readCounter),
                        },
                    }
                )
                .exec();
        }
    );

    public insertRoom = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            orgId: string,
            userId: string,
            name: string | null,
            initialMembers?: string[]
        ) => {
            const members: IRoomMemberReadCounter[] = [userId]
                .concat(initialMembers)
                .map((id) => ({ userId: id, readCounter: getDate() }));

            return saveNewItemToDb(async () => {
                const roomId = getNewId();
                const roomName = name || ctx.room.getChatRoomName(roomId);
                const newRoom = new ctx.models.roomModel.model({
                    orgId,
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

    public insertMessage = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            orgId: string,
            senderId: string,
            roomId: string,
            message: string
        ) => {
            return saveNewItemToDb(async () => {
                const newMessage = new ctx.models.chatModel.model({
                    customId: getNewId(),
                    orgId,
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

    public getUserRoomReadCounter = wrapFireAndThrowError(
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

export const getChatContext = makeSingletonFunc(() => new ChatContext());
