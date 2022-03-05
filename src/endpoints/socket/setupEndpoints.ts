import { Socket } from "socket.io";
import getUserRoomsAndChats from "../chat/getUserRoomsAndChats/getUserRoomsAndChats";
import sendMessage from "../chat/sendMessage/sendMessage";
import updateRoomReadCounter from "../chat/updateRoomReadCounter/updateRoomReadCounter";
import { IBaseContext } from "../contexts/IBaseContext";
import subscribe from "../rooms/subscribe/subscribe";
import unsubscribe from "../rooms/unsubscribe/unsubscribe";
import authSocketHandler from "./incoming/authSocketHandler";
import disconnectSocketHandler from "./incoming/disconnectSocketHandler";
import updateSocketEntry from "./incoming/updateSocketEntry";
import { IncomingSocketEvents } from "./incomingEventTypes";
import { makeSocketHandler } from "./utils";

export async function setupSocketEndpoints(ctx: IBaseContext, socket: Socket) {
    // TODO: move auth to on connection
    socket.on(
        IncomingSocketEvents.Auth,
        makeSocketHandler(ctx, socket, authSocketHandler)
    );

    socket.on(
        IncomingSocketEvents.Disconnect,
        makeSocketHandler(ctx, socket, disconnectSocketHandler, {
            skipDataValidation: true,
        })
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

    socket.on(
        IncomingSocketEvents.UpdateSocketEntry,
        makeSocketHandler(ctx, socket, updateSocketEntry)
    );
}
