import { Socket } from "socket.io";
import { IUser } from "../../mongo/user";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { InvalidRequestError } from "../errors";
import RequestData from "../RequestData";
import { IBaseContext } from "./BaseContext";

export interface ISocketEntry {
    userId: string;
    socketId: string;
    clientId: string;
    socket: Socket;
    isInactive?: boolean;
}

const socketEntries: Record<string, ISocketEntry> = {};
const userIdToEntriesMap: Record<string, Record<string, true>> = {};

export interface ISocketContext {
    assertSocket: (data: RequestData) => boolean;
    assertGetSocket: (data: RequestData) => Socket;
    attachSocketToRequestData: (
        ctx: IBaseContext,
        data: RequestData,
        user: IUser
    ) => Promise<boolean>;
    broadcastToSocket: (
        ctx: IBaseContext,
        socketId: string,
        eventName: string,
        data: any
    ) => boolean;
    insertSocketEntry: (
        ctx: IBaseContext,
        reqData: RequestData
    ) => Promise<void>;
    updateSocketEntry: (
        ctx: IBaseContext,
        socketId: string,
        update: Partial<{ isInactive?: boolean }>
    ) => void;
    getEntriesByUserId: (ctx: IBaseContext, userId: string) => ISocketEntry[];
    getEntryBySocketId: (
        ctx: IBaseContext,
        socketId: string
    ) => ISocketEntry | null;
    removeUserSocketEntries: (ctx: IBaseContext, userId: string) => void;
    removeEntryBySocketId: (ctx: IBaseContext, socketId: string) => void;
}

export default class SocketContext implements ISocketContext {
    public assertSocket(data: RequestData) {
        if (!data.socket) {
            throw new InvalidRequestError();
        }

        return true;
    }

    public assertGetSocket(data: RequestData) {
        if (!data.socket) {
            throw new InvalidRequestError();
        }

        return data.socket;
    }

    public async attachSocketToRequestData(
        ctx: IBaseContext,
        data: RequestData,
        user: IUser
    ) {
        const entries = ctx.socket.getEntriesByUserId(ctx, user.customId);
        const client = await ctx.session.getClient(ctx, data);
        const clientEntry = entries.find(
            (entry) => entry.clientId === client.clientId
        );

        if (clientEntry) {
            if (clientEntry.userId !== user.customId) {
                ctx.socket.removeEntryBySocketId(ctx, clientEntry.socketId);
            } else {
                data.socket = clientEntry.socket;
                return true;
            }
        }

        return false;
    }

    public updateSocketEntry(
        ctx: IBaseContext,
        socketId: string,
        update: Partial<{ isInactive?: boolean }>
    ) {
        if (socketEntries[socketId]) {
            let entry = { ...socketEntries[socketId], ...update };

            // console.log("update socket entry");
            // console.log(
            //     `${socketEntries[socketId].userId} -> old is inactive = ${socketEntries[socketId].isInactive}`
            // );
            // console.log(
            //     `${entry.userId} -> new is inactive = ${entry.isInactive}`
            // );

            socketEntries[socketId] = entry;
        }
    }

    public broadcastToSocket(
        ctx: IBaseContext,
        socketId: string,
        eventName: string,
        data: any
    ) {
        const socket = ctx.socketServerInstance.to(socketId);

        if (socket) {
            socket.emit(eventName, data);
            return true;
        }

        return false;
    }

    insertSocketEntry = async (ctx: IBaseContext, reqData: RequestData) => {
        const client = await ctx.session.getClient(ctx, reqData);
        const socket = ctx.socket.assertGetSocket(reqData);
        const user = await ctx.session.getUser(ctx, reqData);
        let entry: ISocketEntry = {
            socket,
            clientId: client.clientId,
            socketId: socket.id,
            userId: user.customId,
            isInactive: false,
        };

        if (socketEntries[socket.id]) {
            entry = { ...socketEntries[socket.id], ...entry };
        }

        socketEntries[socket.id] = entry;

        // console.log("insert socket entry");
        // console.log(`${entry.userId} -> is inactive = ${entry.isInactive}`);

        const userEntries = userIdToEntriesMap[user.customId] || {};
        userEntries[socket.id] = true;
        userIdToEntriesMap[user.customId] = userEntries;
    };

    getEntriesByUserId = (ctx: IBaseContext, userId: string) => {
        const userEntries = userIdToEntriesMap[userId] || {};
        return Object.keys(userEntries).map((sockId) => socketEntries[sockId]);
    };

    getEntryBySocketId = (ctx: IBaseContext, socketId: string) => {
        return socketEntries[socketId] || null;
    };

    removeUserSocketEntries = (ctx: IBaseContext, userId: string) => {
        const userEntries = userIdToEntriesMap[userId] || {};
        Object.keys(userEntries).map((sockId) => {
            if (socketEntries[sockId]) {
                socketEntries[sockId].socket.disconnect(true);
                delete socketEntries[sockId];
            }
        });

        delete userIdToEntriesMap[userId];
    };

    removeEntryBySocketId = (ctx: IBaseContext, sockId: string) => {
        if (socketEntries[sockId]) {
            socketEntries[sockId].socket.disconnect(true);
            const userEntries =
                userIdToEntriesMap[socketEntries[sockId].userId];

            if (userEntries) {
                delete userEntries[sockId];
            }

            delete socketEntries[sockId];
        }
    };
}

export const getSocketContext = makeSingletonFn(() => new SocketContext());
