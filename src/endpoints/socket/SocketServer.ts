import { Server, Socket } from "socket.io";
import getUserFromRequest from "../../middlewares/getUserFromRequest";
import { IUserModel } from "../../mongo/user";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";
import { ISocketContext } from "../contexts/SocketContext";

async function onConnection(
  SocketContext: ISocketContext,
  socket: Socket,
  userModel: IUserModel
) {
  try {
    const user = await getUserFromRequest({
      req: socket.request,
      userModel,
    });

    SocketContext.saveUserSocketId(socket.id, user.customId);
    socket.on("disconnect", onDisconnect);
  } catch (error) {
    logger.error(error);
    socket.disconnect(true);
  }
}

async function onDisconnect(
  SocketContext: ISocketContext,
  socket: Socket,
  userModel: IUserModel
) {
  try {
    const user = await getUserFromRequest({
      req: socket.request,
      userModel,
    });

    SocketContext.removeUserSocketId(socket.id, user.customId);
  } catch (error) {
    logger.error(error);
  }
}

let socketServer: Server = null;

export function setupSocketServer(io: Server) {
  socketServer = io;
  io.on("connection", onConnection);
}

export function getSocketServer() {
  if (!socketServer) {
    throw new ServerError();
  }

  return socketServer;
}
