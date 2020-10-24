import { Server, Socket } from "socket.io";
import { IChat } from "../../mongo/chat";
import { IRoom } from "../../mongo/room";
import { ServerError } from "../../utilities/errors";
import { IPublicBlock } from "../block/types";
import getUserRoomsAndChats from "../chat/getUserRoomsAndChats/getUserRoomsAndChats";
import sendMessage from "../chat/sendMessage/sendMessage";
import updateRoomReadCounter from "../chat/updateRoomReadCounter/updateRoomReadCounter";
import { getBaseContext, IBaseContext } from "../contexts/BaseContext";
import RequestData from "../contexts/RequestData";
import { IPublicNotificationData } from "../notification/types";
import { JWTEndpoints } from "../types";
import { CollaborationRequestResponse } from "../user/respondToCollaborationRequest/types";
import fetchBroadcasts from "./fetchBroadcasts/fetchBroadcasts";
import subscribe from "./subscribe/subscribe";
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

function sendAck(fn, ack?: any) {
    // sometimes, there isn't an ack return function on socket event
    // I think it's because we currently have the socket.io using both http and socket
    // so when it's using http, there isn't an ack fn
    // possible fix is scticking only to socket, but will need to investigate
    //
    // I also think it's because some of the requests are being made before the socket
    // connection completes authentication, so, maybe wait until auth is complete on the client
    if (fn) {
        fn(ack);
    }
}

async function onConnection(ctx: IBaseContext, socket: Socket) {
    socket.on(
        IncomingSocketEvents.Auth,
        async (data: IIncomingAuthPacket, fn) => {
            try {
                const tokenData = await ctx.session.validateUserToken(
                    ctx,
                    data.token
                );
                const user = await ctx.session.validateUserTokenData(
                    ctx,
                    tokenData,
                    true,
                    JWTEndpoints.Login
                );
                const requestData = RequestData.fromSocketRequest(
                    socket,
                    null,
                    tokenData,
                    data.clientId
                );

                ctx.socket.mapUserToSocketId(requestData, user);

                const userRoomName = ctx.room.getUserRoomName(user.customId);
                ctx.room.subscribe(requestData, userRoomName);

                const result: IOutgoingAuthPacket = {
                    valid: true,
                };

                sendAck(fn, result);
            } catch (error) {
                const result: IOutgoingAuthPacket = { valid: false };
                console.error(error);
                sendAck(fn, result);
                socket.disconnect();
            }
        }
    );

    socket.on("disconnect", () => {
        try {
            // TODO: clear all socket data in the SocketContext
            onDisconnect(ctx, socket);
        } catch (err) {
            console.error(err);
        }
    });

    socket.on(IncomingSocketEvents.Subscribe, async (data, fn) => {
        try {
            await subscribe(
                getBaseContext(),
                RequestData.fromSocketRequest(socket, data)
            );

            sendAck(fn);
        } catch (error) {
            // TODO: improve error handling and send the error back to the clients
            console.error(error);
            sendAck(fn, toSocketReturnError(error));
        }
    });

    socket.on(IncomingSocketEvents.Unsubscribe, async (data, fn) => {
        try {
            await unsubscribe(
                getBaseContext(),
                RequestData.fromSocketRequest(socket, data)
            );

            sendAck(fn);
        } catch (error) {
            console.error(error);
            sendAck(fn, toSocketReturnError(error));
        }
    });

    socket.on(IncomingSocketEvents.FetchMissingBroadcasts, async (data, fn) => {
        try {
            // TODO: complete implementation
            const broadcasts = await fetchBroadcasts(
                getBaseContext(),
                RequestData.fromSocketRequest(socket, data)
            );

            // sendAck(fn, broadcasts);
        } catch (error) {
            console.error(error);
            sendAck(fn, toSocketReturnError(error));
        }
    });

    socket.on(IncomingSocketEvents.GetUserRoomsAndChats, async (data, fn) => {
        try {
            const result = await getUserRoomsAndChats(
                getBaseContext(),
                RequestData.fromSocketRequest(socket, data)
            );

            sendAck(fn, result);
        } catch (error) {
            console.error(error);
            sendAck(fn, toSocketReturnError(error));
        }
    });

    socket.on(IncomingSocketEvents.SendMessage, async (data, fn) => {
        try {
            const chat = await sendMessage(
                getBaseContext(),
                RequestData.fromSocketRequest(socket, data)
            );

            sendAck(fn, chat);
        } catch (error) {
            console.error(error);
            sendAck(fn, toSocketReturnError(error));
        }
    });

    socket.on(IncomingSocketEvents.UpdateRoomReadCounter, async (data, fn) => {
        try {
            await updateRoomReadCounter(
                getBaseContext(),
                RequestData.fromSocketRequest(socket, data)
            );

            sendAck(fn);
        } catch (error) {
            console.error(error);
            sendAck(fn, toSocketReturnError(error));
        }
    });
}

function toSocketReturnError(err) {
    const errors = Array.isArray(err) ? err : [err];
    return {
        errors,
    };
}

async function onDisconnect(ctx: IBaseContext, socket: Socket) {
    // TODO: leave all the rooms the socket was a part of
    try {
        ctx.socket.removeSocketIdAndUser(RequestData.fromSocketRequest(socket));
    } catch (error) {
        console.error(error);
    }
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

enum IncomingSocketEvents {
    Subscribe = "subscribe",
    Unsubscribe = "unsubscribe",
    Auth = "auth",
    FetchMissingBroadcasts = "fetchMissingBroadcasts",
    SendMessage = "sendMessage",
    GetUserRoomsAndChats = "getUserRoomsAndChats",
    UpdateRoomReadCounter = "updateRoomReadCounter",
}

export enum OutgoingSocketEvents {
    BlockUpdate = "blockUpdate",
    OrgNewNotifications = "orgNewNotifications",
    UserNewNotifications = "userNewNotifications",
    UserUpdate = "userUpdate",
    UpdateNotification = "updateNotification",
    UserCollaborationRequestResponse = "userCollabReqResponse",
    OrgCollaborationRequestResponse = "orgCollabReqResponse",
    NewRoom = "newRoom",
    NewMessage = "newMessage",
    UpdateRoomReadCounter = "updateRoomReadCounter",
}

export interface IIncomingAuthPacket {
    token: string;
    clientId: string;
}

export interface IOutgoingAuthPacket {
    valid: boolean;
}

export interface IBlockUpdatePacket {
    customId: string;
    isNew?: boolean;
    isUpdate?: boolean;
    isDelete?: boolean;
    block?: Partial<IPublicBlock>;
}

export interface INewNotificationsPacket {
    notifications: IPublicNotificationData[];
}

export interface IUserUpdatePacket {
    notificationsLastCheckedAt: string;
}

export interface IUpdateNotificationPacket {
    customId: string;
    data: { readAt: string };
}

export interface IUserCollaborationRequestResponsePacket {
    customId: string;
    response: CollaborationRequestResponse;
    org?: IPublicBlock;
}

export interface IOrgCollaborationRequestResponsePacket {
    customId: string;
    response: CollaborationRequestResponse;
}

export interface IOutgoingNewRoomPacket {
    room: IRoom;
}

export interface IOutgoingSendMessagePacket {
    chat: IChat;
}

export interface IOutgoingUpdateRoomReadCounterPacket {
    roomId: string;
    member: {
        userId: string;
        readCounter: string;
    };
}
