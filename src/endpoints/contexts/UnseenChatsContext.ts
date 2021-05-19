import { IUnseenChats } from "../../mongo/unseenChats";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDateString } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import { wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";
import moment from "moment";

export interface IUnseenChatsContext {
    addEntry: (
        ctx: IBaseContext,
        userId: string,
        roomId: string
    ) => Promise<IUnseenChats>;
    removeEntry: (ctx: IBaseContext, userId: string) => Promise<void>;
    consume: (
        ctx: IBaseContext,
        count?: number,
        fromDate?: string
    ) => Promise<IUnseenChats[]>;
    sumUnseenChatsAndRooms: (
        ctx: IBaseContext,
        data: IUnseenChats
    ) => { roomsCount: number; chatsCount: number };
}

export default class UnseenChatsContext implements IUnseenChatsContext {
    public addEntry = wrapFireAndThrowError(
        async (ctx: IBaseContext, userId: string, roomId: string) => {
            let data = await ctx.models.unseenChatsModel.model
                .findOne({
                    userId,
                })
                .lean()
                .exec();

            if (!data) {
                data = {
                    userId,
                    rooms: {},
                    createdAt: getDateString(),
                    customId: getNewId(),
                };
            }

            data.rooms[roomId] = (data.rooms[roomId] || 0) + 1;
            await ctx.models.unseenChatsModel.model.updateOne(
                { userId },
                data,
                { upsert: true }
            );

            return data;
        }
    );

    public removeEntry = wrapFireAndThrowError(
        async (ctx: IBaseContext, userId: string) => {
            await ctx.models.unseenChatsModel.model
                .deleteMany({
                    userId,
                })
                .exec();
        }
    );

    public consume = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            count: number = 100,
            fromDate: string = moment().subtract(1, "days").toISOString()
        ) => {
            const data = await ctx.models.unseenChatsModel.model
                .find(
                    {
                        createdAt: { $gte: fromDate },
                    },
                    { count }
                )
                .lean()
                .exec();

            if (data.length > 0) {
                const ids = data.map((item) => item.customId);
                await ctx.models.unseenChatsModel.model
                    .deleteMany({ customId: { $in: ids } })
                    .exec();
            }

            return data;
        }
    );

    public sumUnseenChatsAndRooms = wrapFireAndThrowError(
        (ctx: IBaseContext, data: IUnseenChats) => {
            let roomsCount = 0;
            let chatsCount = 0;

            for (let roomId in data.rooms) {
                const roomChatsCount = data.rooms[roomId] || 0;
                roomsCount += 1;
                chatsCount += roomChatsCount;
            }

            return { roomsCount, chatsCount };
        }
    );
}

export const getUnseenChatsContext = makeSingletonFunc(
    () => new UnseenChatsContext()
);
