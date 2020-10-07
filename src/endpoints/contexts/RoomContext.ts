import { Server } from "socket.io";
import { AuditLogResourceType } from "../../mongo/audit-log";
import { IBlock } from "../../mongo/block";
import { INote } from "../../mongo/note";
import { IUser } from "../../mongo/user";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import getNewId from "../../utilities/getNewId";
import { OutgoingSocketEvents } from "../socket/server";
import { IBaseContext } from "./BaseContext";
import RequestData from "./RequestData";

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
    getBlockRoomName: (block: IBlock) => string;
    getNoteRoomName: (note: INote) => string;
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
    public subscribe(data: RequestData, roomName: string) {
        if (data.socket) {
            joinRoom(roomName, data.socket.id);
        }
    }

    public leave(data: RequestData, roomName: string) {
        if (data.socket) {
            leaveRoom(roomName, data.socket.id);
        }
    }

    public isUserInRoom(ctx: IBaseContext, roomName: string, userId: string) {
        const socketEntries = ctx.socket.getUserSocketEntries(ctx, userId);
        const room = rooms[roomName];

        if (!room) {
            return false;
        }

        return !!socketEntries.find((entry) => !!room[entry.socket.id]);
    }

    public subscribeUser(ctx: IBaseContext, roomName: string, userId: string) {
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

    public unSubscribeUser(
        ctx: IBaseContext,
        roomName: string,
        userId: string
    ) {
        const socketEntries = ctx.socket.getUserSocketEntries(ctx, userId);
        const room = rooms[roomName] || {};
        socketEntries.find((entry) => {
            delete room[entry.socket.id];
        });

        rooms[roomName] = room;
    }

    public broadcast(
        ctx: IBaseContext,
        roomName: string,
        eventName: OutgoingSocketEvents,
        eventData: any,
        data: RequestData
    ) {
        broadcast(
            roomName,
            eventName,
            eventData,
            ctx.socketServer,
            data.socket?.id
        );

        ctx.broadcastHistory.insert(ctx, data, roomName, {
            data: eventData,
            event: eventName,
        });
    }

    public getUserRoomName(userId: string) {
        return `${AuditLogResourceType.User}-${userId}`;
    }

    public getBlockRoomName(block: IBlock) {
        return `${block.type}-${block.customId}`;
    }

    public getNoteRoomName(note: INote) {
        return `${AuditLogResourceType.Note}-${note.customId}`;
    }

    public getChatRoomName(roomId: string) {
        return `${AuditLogResourceType.Room}-${roomId}`;
    }
}

export const getRoomContext = createSingletonFunc(() => new RoomContext());
