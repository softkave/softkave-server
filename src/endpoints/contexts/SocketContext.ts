import { Socket } from "socket.io";
import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { InvalidRequestError } from "../errors";
import RequestData from "../RequestData";
import { IBaseContext } from "./BaseContext";

export interface IUserClientSocketEntry {
    clientId: string;
    socket: Socket;

    // TODO:
    // Should we keep a list of all the rooms a client is subscribed to?
    // It'll make re-subscribing after socket reconnection and removing the socket from the room
    // on disconnection easier. But we'll only keep the data for some minutes, because the client
    // could have genuinely disconnected
}

export interface IAuthenticatedSocketEntry {
    userId: string;

    // marks whether the user is currently viewing the page
    isInactive?: boolean;
}

const authenticatedSockets: { [key: string]: IAuthenticatedSocketEntry } = {};
const userIdToSocketEntriesMap: {
    [key: string]: IUserClientSocketEntry[];
} = {};

export interface ISocketContext {
    assertSocket: (data: RequestData) => boolean;
    mapUserToSocketId: (data: RequestData, user: IUser) => void;
    disconnectSocket: (data: RequestData) => void;
    disconnectUser: (userId: string) => void;
    getUserIdBySocketId: (data: RequestData) => string | undefined;
    attachSocketToRequestData: (
        ctx: IBaseContext,
        data: RequestData,
        user: IUser
    ) => boolean;
    getUserSocketEntries: (
        ctx: IBaseContext,
        userId: string
    ) => IUserClientSocketEntry[];
    updateSocketEntry: (
        ctx: IBaseContext,
        socketId: string,
        update: Partial<{ isInactive?: boolean }>
    ) => void;
    getSocketEntry: (
        ctx: IBaseContext,
        socketId: string
    ) => IAuthenticatedSocketEntry;
}

export default class SocketContext implements ISocketContext {
    public assertSocket(data: RequestData) {
        if (!data.socket) {
            throw new InvalidRequestError();
        }

        return true;
    }

    public mapUserToSocketId(data: RequestData, user: IUser) {
        authenticatedSockets[data.socket.id] = {
            userId: user.customId,
        };

        const existingSocketIndex = this.getSocketIndex(
            user.customId,
            data.socket.id
        );

        if (existingSocketIndex !== -1) {
            return;
        }

        const sockets = userIdToSocketEntriesMap[user.customId] || [];

        sockets.push({
            clientId: data.clientId,
            socket: data.socket,
        });

        userIdToSocketEntriesMap[user.customId] = sockets;
    }

    public disconnectSocket(data: RequestData) {
        const entry = authenticatedSockets[data.socket.id];

        if (!entry) {
            return;
        }

        delete authenticatedSockets[data.socket.id];
        const socketIndex = this.getSocketIndex(entry.userId, data.socket.id);

        if (socketIndex === -1) {
            return;
        }

        const socketEntries = userIdToSocketEntriesMap[entry.userId];
        socketEntries.splice(socketIndex, 1);

        if (socketEntries.length > 0) {
            userIdToSocketEntriesMap[entry.userId] = socketEntries;
        } else {
            delete userIdToSocketEntriesMap[entry.userId];
        }
    }

    public disconnectUser(userId: string) {
        const socketEntries = userIdToSocketEntriesMap[userId];

        if (!socketEntries) {
            return;
        }

        delete userIdToSocketEntriesMap[userId];

        socketEntries.forEach((entry) => {
            delete authenticatedSockets[entry.socket.id];
        });
    }

    public getUserIdBySocketId(data: RequestData) {
        return authenticatedSockets[data.socket.id]?.userId;
    }

    public attachSocketToRequestData(
        ctx: IBaseContext,
        data: RequestData,
        user: IUser
    ) {
        const socketEntries = userIdToSocketEntriesMap[user.customId];

        if (!socketEntries) {
            // TODO: this, and the next should be an error, shouldn't it?
            return false;
        }

        if (socketEntries.length === 0) {
            delete userIdToSocketEntriesMap[user.customId];
            return false;
        }

        const clientId = data.clientId;

        if (!clientId) {
            return false;
        }

        const entryIndex = socketEntries.findIndex(
            (entry) => entry.clientId === clientId
        );

        if (entryIndex === -1) {
            return false;
        }

        const socketEntry = socketEntries[entryIndex];
        const entry = authenticatedSockets[socketEntry.socket.id];

        if (!entry || entry.userId !== user.customId) {
            this.disconnectUser(entry.userId);
            return false;
        }

        data.socket = socketEntry.socket;
        return true;
    }

    public getUserSocketEntries(ctx: IBaseContext, userId: string) {
        return userIdToSocketEntriesMap[userId] || [];
    }

    public updateSocketEntry(
        ctx: IBaseContext,
        socketId: string,
        update: Partial<{ isInactive?: boolean }>
    ) {
        if (!authenticatedSockets[socketId]) {
            return;
        }

        const entry = { ...authenticatedSockets[socketId], ...update };
        authenticatedSockets[socketId] = entry;
    }

    public getSocketEntry(ctx: IBaseContext, socketId: string) {
        return authenticatedSockets[socketId];
    }

    private getSocketIndex(userId: string, socketId: string) {
        const sockets = userIdToSocketEntriesMap[userId];

        if (!sockets) {
            return -1;
        }

        const socketIndex = sockets.findIndex(
            (entry) => entry.socket.id === socketId
        );

        return socketIndex;
    }
}

export const getSocketContext = makeSingletonFunc(() => new SocketContext());
