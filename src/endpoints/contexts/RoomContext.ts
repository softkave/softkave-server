import { SystemResourceType } from "../../models/system";
import { BlockType } from "../../mongo/block";
import getSingletonFunc from "../../utilities/createSingletonFunc";
import RequestData from "../RequestData";
import { OutgoingSocketEvents } from "../socket/outgoingEventTypes";
import { wrapFireAndThrowErrorAsync } from "../utils";
import { IBaseContext } from "./BaseContext";
import { ISocketEntry } from "./SocketContext";

/**
 * RoomContext
 * RoomContext handles the joining, leaving, and broadcasting of data in rooms
 * to connected client sockets. It also provides functions to generate 'pure'
 * ( meaning the same arguments always produce the same results ) room names for
 * resource types.
 *
 * We are currently using our own rooms implementation, and not the one from
 * socket.io ( the underlying socket library we're using ), because the socket.io
 * version of rooms was inconsistent and error prone.
 */

export interface IBroadcastResult {
    endpoints: Array<{
        didBroadcast: boolean;
        entry: ISocketEntry;
    }>;
}

export interface IRoomContext {
    subscribe: (data: RequestData, roomName: string) => void;
    subscribeUser: (
        ctx: IBaseContext,
        roomName: string,
        userId: string
    ) => void;
    unSubscribeUser: (
        ctx: IBaseContext,
        roomName: string,
        userId: string
    ) => void;
    leave: (data: RequestData, roomName: string) => void;
    broadcast: (
        ctx: IBaseContext,
        data: RequestData,
        roomName: string,
        eventName: OutgoingSocketEvents,
        eventData: any,
        excludeSender?: boolean,
        activeSocketsOnly?: boolean
    ) => Promise<IBroadcastResult>;
    isUserInRoom: (
        ctx: IBaseContext,
        roomName: string,
        userId: string
    ) => boolean;
    getBlockRoomName: (type: BlockType, id: string) => string;
    getUserRoomName: (userId: string) => string;
    getChatRoomName: (roomId: string) => string;
}

// TODO: write a test to see if making the internal object an array and looping through it is faster
const rooms: { [key: string]: { [key: string]: boolean } } = {};

function joinRoom(roomName: string, socketId: string) {
    const room = rooms[roomName] || {};
    room[socketId] = true;
    rooms[roomName] = room;
}

function leaveRoom(roomName: string, socketId: string) {
    const room = rooms[roomName] || {};
    delete room[socketId];
    rooms[roomName] = room;
}

function broadcast(
    ctx: IBaseContext,
    reqData: RequestData,
    roomName: string,
    eventId: string,
    data: any,
    excludeSocketId?: string,
    activeSocketsOnly?: boolean
) {
    const room = rooms[roomName] || {};
    const omit = {};
    const result: IBroadcastResult = {
        endpoints: [],
    };

    if (excludeSocketId) {
        omit[excludeSocketId] = true;
    }

    for (const socketId in room) {
        // TODO: write a test to see if === comparison is faster than object comparison
        if (omit[socketId]) {
            continue;
        }

        const entry = ctx.socket.getEntryBySocketId(ctx, socketId);

        if (!entry) {
            // TODO: log
            delete room[socketId];
            continue;
        }

        if (entry.isInactive && activeSocketsOnly) {
            result.endpoints.push({
                entry,
                didBroadcast: false,
            });

            continue;
        }

        const socketExists = ctx.socket.broadcastToSocket(
            ctx,
            socketId,
            eventId,
            data
        );

        if (socketExists) {
            result.endpoints.push({
                entry,
                didBroadcast: true,
            });
        } else {
            // TODO: log
            delete room[socketId];
            ctx.socket.removeEntryBySocketId(ctx, socketId);
            continue;
        }
    }

    return result;
}

export default class RoomContext implements IRoomContext {
    public subscribe = wrapFireAndThrowErrorAsync(
        (data: RequestData, roomName: string) => {
            if (data.socket) {
                joinRoom(roomName, data.socket.id);
            }
        }
    );

    public leave = wrapFireAndThrowErrorAsync(
        (data: RequestData, roomName: string) => {
            if (data.socket) {
                leaveRoom(roomName, data.socket.id);
            }
        }
    );

    public isUserInRoom = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, roomName: string, userId: string) => {
            const socketEntries = ctx.socket.getEntriesByUserId(ctx, userId);
            const room = rooms[roomName];

            if (!room) {
                return false;
            }

            return !!socketEntries.find((entry) => !!room[entry.socket.id]);
        }
    );

    public subscribeUser = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, roomName: string, userId: string) => {
            const socketEntries = ctx.socket.getEntriesByUserId(ctx, userId);

            if (socketEntries.length === 0) {
                return;
            }

            const room = rooms[roomName] || {};
            socketEntries.find((entry) => {
                room[entry.socket.id] = true;
            });

            rooms[roomName] = room;
        }
    );

    public unSubscribeUser = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, roomName: string, userId: string) => {
            const socketEntries = ctx.socket.getEntriesByUserId(ctx, userId);
            const room = rooms[roomName] || {};
            socketEntries.find((entry) => {
                delete room[entry.socket.id];
            });

            rooms[roomName] = room;
        }
    );

    public broadcast = wrapFireAndThrowErrorAsync(
        async (
            ctx: IBaseContext,
            data: RequestData,
            roomName: string,
            eventName: OutgoingSocketEvents,
            eventData: any,
            excludeSender?: boolean,
            activeSocketsOnly?: boolean
        ) => {
            // TODO: how can we make this better? Also, getUser I think calls mongo again
            if (data && !data.socket) {
                const user = await ctx.session.getUser(ctx, data);
                await ctx.socket.attachSocketToRequestData(ctx, data, user);
            }

            const result = broadcast(
                ctx,
                data,
                roomName,
                eventName,
                eventData,
                excludeSender && data?.socket?.id,
                activeSocketsOnly
            );

            ctx.broadcastHistory.insert(ctx, roomName, {
                data: eventData,
                event: eventName,
            });

            return result;
        }
    );

    public getUserRoomName(userId: string) {
        return `${SystemResourceType.User}-${userId}`;
    }

    public getBlockRoomName(type: BlockType, id: string) {
        return `${type}-${id}`;
    }

    public getChatRoomName(roomId: string) {
        return `${SystemResourceType.Room}-${roomId}`;
    }
}

export const getRoomContext = getSingletonFunc(() => new RoomContext());
