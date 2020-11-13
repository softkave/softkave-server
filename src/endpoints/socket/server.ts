import { Server, Socket } from "socket.io";
import { ServerError } from "../../utilities/errors";
import getUserRoomsAndChats from "../chat/getUserRoomsAndChats/getUserRoomsAndChats";
import sendMessage from "../chat/sendMessage/sendMessage";
import updateRoomReadCounter from "../chat/updateRoomReadCounter/updateRoomReadCounter";
import { getBaseContext, IBaseContext } from "../contexts/BaseContext";
import fetchBroadcasts from "../rooms/fetchBroadcasts/fetchBroadcasts";
import subscribe from "../rooms/subscribe/subscribe";
import unsubscribe from "../rooms/unsubscribe/unsubscribe";
import authSocketHandler from "./incoming/authSocketHandler";
import disconnectSocketHandler from "./incoming/disconnectSocketHandler";
import { IncomingSocketEvents } from "./incomingEventTypes";
import { makeSocketHandler } from "./utils";

// REMINDER
// The current implementation authenticates once, then accepts all other requests
// This can be problematic in a number of ways
// Fixes include adding the user token to the header and authenticating on every request
// Problem with this is that it's only available when using polling ( which is currently the default option )
//   but this can be problematic if we decide to move to pure web sockets
// Another fix is passing the token with every request, this can work
// But if there's no possibility of exploitation with current implementation,
//   then that  wastes compute resources
// Also, what happens when the user changes their password?
// Maybe if the user changes password or auth token is changed, the socket will only auth again

// TODO: disconnect sockets that don't auth in 5 minutes

async function onConnection(ctx: IBaseContext, socket: Socket) {
    socket.on(
        IncomingSocketEvents.Auth,
        makeSocketHandler(ctx, socket, authSocketHandler)
    );
    socket.on(
        "disconnect",
        makeSocketHandler(ctx, socket, disconnectSocketHandler)
    );
    socket.on(
        IncomingSocketEvents.Subscribe,
        makeSocketHandler(ctx, socket, subscribe)
    );
    socket.on(
        IncomingSocketEvents.Unsubscribe,
        makeSocketHandler(ctx, socket, unsubscribe)
    );
    socket.on(
        IncomingSocketEvents.FetchMissingBroadcasts,
        makeSocketHandler(ctx, socket, fetchBroadcasts)
    );
    socket.on(
        IncomingSocketEvents.GetUserRoomsAndChats,
        makeSocketHandler(ctx, socket, getUserRoomsAndChats)
    );
    socket.on(
        IncomingSocketEvents.SendMessage,
        makeSocketHandler(ctx, socket, sendMessage)
    );
    socket.on(
        IncomingSocketEvents.UpdateRoomReadCounter,
        makeSocketHandler(ctx, socket, updateRoomReadCounter)
    );
}

let socketServer: Server = null;

export function setupSocketServer(io: Server) {
    socketServer = io;
    io.on("connection", (socket) => {
        onConnection(getBaseContext(), socket);
    });
}

export function getSocketServer() {
    if (!socketServer) {
        throw new ServerError();
    }

    return socketServer;
}
