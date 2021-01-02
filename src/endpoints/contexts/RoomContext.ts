import { Server } from "socket.io";
import { SystemResourceType } from "../../models/system";
import { BlockType } from "../../mongo/block";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import RequestData from "../RequestData";
import { OutgoingSocketEvents } from "../socket/outgoingEventTypes";
import { wrapFireAndDontThrow } from "../utils";
import { IBaseContext } from "./BaseContext";

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
        roomName: string,
        eventName: string,
        eventData: any,
        data?: RequestData
    ) => void;
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
    roomName: string,
    eventId: string,
    data: any,
    io: Server,
    fromSocketId?: string
) {
    const room = rooms[roomName] || {};
    const omit = {};

    if (fromSocketId) {
        omit[fromSocketId] = true;
    }

    for (const socketId in room) {
        // TODO: write a test to see if === comparison is faster than object comparison
        if (omit[socketId]) {
            continue;
        }

        const socket = io.to(socketId);

        if (!socket) {
            // TODO: log
            delete room[socketId];
            continue;
        }

        socket.emit(eventId, data);
    }
}

export default class RoomContext implements IRoomContext {
    public subscribe = wrapFireAndDontThrow(
        (data: RequestData, roomName: string) => {
            if (data.socket) {
                joinRoom(roomName, data.socket.id);
            }
        }
    );

    public leave = wrapFireAndDontThrow(
        (data: RequestData, roomName: string) => {
            if (data.socket) {
                leaveRoom(roomName, data.socket.id);
            }
        }
    );

    public isUserInRoom = wrapFireAndDontThrow(
        (ctx: IBaseContext, roomName: string, userId: string) => {
            const socketEntries = ctx.socket.getUserSocketEntries(ctx, userId);
            const room = rooms[roomName];

            if (!room) {
                return false;
            }

            return !!socketEntries.find((entry) => !!room[entry.socket.id]);
        }
    );

    public subscribeUser = wrapFireAndDontThrow(
        (ctx: IBaseContext, roomName: string, userId: string) => {
            const socketEntries = ctx.socket.getUserSocketEntries(ctx, userId);

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

    public unSubscribeUser = wrapFireAndDontThrow(
        (ctx: IBaseContext, roomName: string, userId: string) => {
            const socketEntries = ctx.socket.getUserSocketEntries(ctx, userId);
            const room = rooms[roomName] || {};
            socketEntries.find((entry) => {
                delete room[entry.socket.id];
            });

            rooms[roomName] = room;
        }
    );

    public broadcast = wrapFireAndDontThrow(
        async (
            ctx: IBaseContext,
            roomName: string,
            eventName: OutgoingSocketEvents,
            eventData: any,
            data?: RequestData
        ) => {
            // TODO: how can we make this better? Also, getUser I think calls mongo again
            if (data && !data.socket) {
                const user = await ctx.session.getUser(ctx, data);
                ctx.socket.attachSocketToRequestData(ctx, data, user);
            }

            broadcast(
                roomName,
                eventName,
                eventData,
                ctx.socketServer,
                data?.socket?.id
            );

            ctx.broadcastHistory.insert(ctx, roomName, {
                data: eventData,
                event: eventName,
            });
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

export const getRoomContext = makeSingletonFunc(() => new RoomContext());
