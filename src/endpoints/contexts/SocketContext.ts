import { Socket } from "socket.io";
import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { InvalidRequestError } from "../errors";
import RequestData from "../RequestData";
import { IBaseContext } from "./BaseContext";

export interface IUserClientSocketEntry {
    clientId: string;
    socket: Socket;

    // marks whether the user is currently viewing the page
    isActive?: boolean;

    // TODO:
    // Should we keep a list of all the rooms a client is subscribed to?
    // It'll make re-subscribing after socket reconnection and removing the socket from the room
    // on disconnection easier. But we'll only keep the data for some minutes, because the client
    // could have genuinely disconnected
}

const authenticatedSockets: { [key: string]: string } = {};
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
        userId: string,
        clientId: string,
        update: Partial<{ isActive?: boolean }>
    ) => void;
}

export default class SocketContext implements ISocketContext {
    public assertSocket(data: RequestData) {
        if (!data.socket) {
            throw new InvalidRequestError();
        }

        return true;
    }

    public mapUserToSocketId(data: RequestData, user: IUser) {
        authenticatedSockets[data.socket.id] = user.customId;

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
        const userId = authenticatedSockets[data.socket.id];

        if (!userId) {
            return;
        }

        delete authenticatedSockets[data.socket.id];

        const socketIndex = this.getSocketIndex(userId, data.socket.id);

        if (socketIndex === -1) {
            return;
        }

        const socketEntries = userIdToSocketEntriesMap[userId];

        socketEntries.splice(socketIndex, 1);

        if (socketEntries.length > 0) {
            userIdToSocketEntriesMap[userId] = socketEntries;
        } else {
            delete userIdToSocketEntriesMap[userId];
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
        return authenticatedSockets[data.socket.id];
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
        const userId = authenticatedSockets[socketEntry.socket.id];

        if (!userId || userId !== user.customId) {
            this.disconnectUser(userId);
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
        userId: string,
        clientId: string,
        update: Partial<{ isActive?: boolean }>
    ) {
        const entries = userIdToSocketEntriesMap[userId];

        if (!entries) {
            return;
        }

        const entryIndex = entries.findIndex(
            (entry) => entry.clientId === clientId
        );

        if (entryIndex == -1) {
            return;
        }

        const entry = { ...entries[entryIndex], ...update };
        entries[entryIndex] = entry;
        userIdToSocketEntriesMap[userId] = entries;
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
