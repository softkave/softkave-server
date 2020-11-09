import { Server, Socket } from "socket.io";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";
import getUserRoomsAndChats from "../chat/getUserRoomsAndChats/getUserRoomsAndChats";
import sendMessage from "../chat/sendMessage/sendMessage";
import updateRoomReadCounter from "../chat/updateRoomReadCounter/updateRoomReadCounter";
import { getBaseContext, IBaseContext } from "../contexts/BaseContext";
import RequestData from "../contexts/RequestData";
import authSocketHandler from "./eventHandlers/authSocketHandler";
import disconnectSocketHandler from "./eventHandlers/disconnectSocketHandler";
import fetchBroadcasts from "./fetchBroadcasts/fetchBroadcasts";
import { IncomingSocketEvents } from "./incomingEventTypes";
import subscribe from "./subscribe/subscribe";
import { IOutgoingSocketEventPacket, SocketEventHandler } from "./types";
import unsubscribe from "./unsubscribe/unsubscribe";

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

export function sendAck(fn, data?: any, errors?: any) {
    // sometimes, there isn't an ack return function on socket event
    // I think it's because we currently have the socket.io using both http and socket
    // so when it's using http, there isn't an ack fn
    // possible fix is scticking only to socket, but will need to investigate
    //
    // I also think it's because some of the requests are being made before the socket
    // connection completes authentication, so, maybe wait until auth is complete on the client
    if (fn) {
        const ack: IOutgoingSocketEventPacket<any> = {
            data,
            errors: (Array.isArray(errors) ? errors : [errors]) as any,
        };

        fn(ack);
    }
}

function makeHandler(
    ctx: IBaseContext,
    socket: Socket,
    handler: SocketEventHandler
) {
    return async (data, fn) => {
        try {
            const requestData = RequestData.fromSocketRequest(
                socket,
                data,
                handler.skipTokenHandling
            );
            const result = await handler(ctx, requestData, fn);

            sendAck(fn, result);
        } catch (error) {
            logger.error(error);
            sendAck(fn, undefined, error);
        }
    };
}

async function onConnection(ctx: IBaseContext, socket: Socket) {
    socket.on(
        IncomingSocketEvents.Auth,
        makeHandler(ctx, socket, authSocketHandler)
    );
    socket.on("disconnect", makeHandler(ctx, socket, disconnectSocketHandler));
    socket.on(
        IncomingSocketEvents.Subscribe,
        makeHandler(ctx, socket, subscribe)
    );
    socket.on(
        IncomingSocketEvents.Unsubscribe,
        makeHandler(ctx, socket, unsubscribe)
    );
    socket.on(IncomingSocketEvents.FetchMissingBroadcasts, fetchBroadcasts);
    socket.on(IncomingSocketEvents.GetUserRoomsAndChats, getUserRoomsAndChats);
    socket.on(IncomingSocketEvents.SendMessage, sendMessage);
    socket.on(
        IncomingSocketEvents.UpdateRoomReadCounter,
        updateRoomReadCounter
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
