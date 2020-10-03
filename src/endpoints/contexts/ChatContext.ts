import { IChat } from "../../mongo/chat";
import mongoConstants from "../../mongo/constants";
import { IRoom, IRoomMemberWithReadCounter } from "../../mongo/room";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { ServerError } from "../../utilities/errors";
import { getDate } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import logger from "../../utilities/logger";
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
}

export default class ChatContext implements IChatContext {
    public async getMessages(ctx: IBaseContext, roomIds: string[]) {
        try {
            return await ctx.models.chatModel.model
                .find({
                    roomId: { $in: roomIds },
                })
                .exec();
        } catch (error) {
            logger.error(error);
            throw new ServerError();
        }
    }

    public async getRooms(ctx: IBaseContext, userId: string) {
        try {
            return await ctx.models.roomModel.model
                .find({
                    members: { $elemMatch: { userId } },
                })
                .exec();
        } catch (error) {
            logger.error(error);
            throw new ServerError();
        }
    }

    public async getRoomById(ctx: IBaseContext, roomId: string) {
        try {
            return await ctx.models.roomModel.model
                .findOne({
                    customId: roomId,
                })
                .exec();
        } catch (error) {
            logger.error(error);
            throw new ServerError();
        }
    }

    public async addMemberToRoom(
        ctx: IBaseContext,
        roomId: string,
        userId: string
    ) {
        try {
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
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async updateMemberReadCounter(
        ctx: IBaseContext,
        roomId: string,
        userId: string,
        readCounter?: Date | string
    ) {
        try {
            await ctx.models.roomModel.model
                .updateOne(
                    {
                        customId: roomId,
                        members: { $elemMatch: { userId } },
                    },
                    {
                        $set: {
                            "members.$.readCounter": readCounter || getDate(),
                        },
                    }
                )
                .exec();
        } catch (error) {
            console.error(error);
            throw new ServerError();
        }
    }

    public async insertMessage(
        ctx: IBaseContext,
        orgId: string,
        senderId: string,
        roomId: string,
        message: string
    ) {
        try {
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
        } catch (error) {
            logger.error(error);

            // Adding a block fails with code 11000 if unique fields like customId
            if (error.code === mongoConstants.indexNotUniqueErrorCode) {
                // TODO: Implement a way to get a new customId and retry
                throw new ServerError();
            }

            console.error(error);
            throw new ServerError();
        }
    }

    public async insertRoom(
        ctx: IBaseContext,
        orgId: string,
        userId: string,
        name: string,
        initialMembers?: string[]
    ) {
        try {
            const members: IRoomMemberWithReadCounter[] = [userId]
                .concat(initialMembers)
                .map((id) => ({ userId: id, readCounter: getDate() }));

            const newRoom = new ctx.models.roomModel.model({
                customId: getNewId(),
                orgId,
                members,
                name,
                createdAt: getDate(),
                createdBy: userId,
            });

            await newRoom.save();
            return newRoom;
        } catch (error) {
            logger.error(error);

            // Adding a block fails with code 11000 if unique fields like customId
            if (error.code === mongoConstants.indexNotUniqueErrorCode) {
                // TODO: Implement a way to get a new customId and retry
                throw new ServerError();
            }

            console.error(error);
            throw new ServerError();
        }
    }

    public async insertPrivateMessage(ctx: IBaseContext, data: IChat) {
        try {
            const c = new ctx.models.chatModel.model(data);
            await c.save();
            return c;
        } catch (error) {
            logger.error(error);
            throw new ServerError();
        }
    }
}

export const getChatContext = createSingletonFunc(() => new ChatContext());
