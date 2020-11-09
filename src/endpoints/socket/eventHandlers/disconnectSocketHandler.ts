import logger from "../../../utilities/logger";
import { SocketEventHandler } from "../types";

const disconnectSocketHandler: SocketEventHandler = async (ctx, data) => {
    // TODO: clear all socket data in the SocketContext and leave all the rooms the socket was a part of
    try {
        ctx.socket.disconnectSocket(data);
    } catch (error) {
        logger.error(error);
    }
};

disconnectSocketHandler.skipTokenHandling = true;

export default disconnectSocketHandler;
