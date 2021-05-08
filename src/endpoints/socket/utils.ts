import { Socket } from "socket.io";
import { validate } from "../../utilities/joiUtils";
import { IBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { SocketEventHandler } from "./types";
import socketValidationSchemas from "./validation";

export function sendAck(fn, data?: any) {
    // TODO: sometimes, there isn't an ack return function on socket event
    // I think it's because we currently have the socket.io using both http and socket
    // so when it's using http, there isn't an ack fn
    // possible fix is scticking only to socket, but will need to investigate

    // I also think it's because some of the requests are being made before the socket
    // connection completes authentication, so, maybe wait until auth is complete on the client
    if (fn) {
        fn(data);
    }
}

export function makeSocketHandler(
    ctx: IBaseContext,
    socket: Socket,
    handler: SocketEventHandler
) {
    return async (data: any, fn?: any) => {
        try {
            const validatedData = validate(
                data,
                socketValidationSchemas.incomingEventData
            );

            const requestData = await RequestData.fromSocketRequest(
                ctx,
                socket,
                validatedData,
                handler.skipTokenHandling
            );

            const result = await handler(ctx, requestData, fn);
            sendAck(fn, result);
        } catch (error) {
            console.error(error);
            sendAck(fn, { errors: Array.isArray(error) ? error : [error] });
        }
    };
}
