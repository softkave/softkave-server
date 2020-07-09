import { Server, Socket } from "socket.io";
import { InvalidRequestError } from "../errors";

const userIdToSocketIdsMap: { [key: string]: string[] } = {};

export interface ISocketContextStaticData {
  socketServer: Server;
}

export interface ISocketContextInstanceData {
  socket?: Socket;
}

export interface ISocketContext {
  saveUserSocketId: (socketId: string, userId: string) => void;
  getUserSocketIds: (userId: string) => string[];
  removeUserSocketId: (socketId: string, userId: string) => void;
  assertSocket: (instData: ISocketContextInstanceData) => boolean;
}

export default class SocketContext implements ISocketContext {
  public saveUserSocketId(socketId: string, userId: string) {
    const socketIds = userIdToSocketIdsMap[userId] || [];

    if (!socketIds.includes(socketId)) {
      socketIds.push(socketId);
    }

    userIdToSocketIdsMap[userId] = socketIds;
  }

  public getUserSocketIds(userId: string) {
    return userIdToSocketIdsMap[userId] || [];
  }

  public removeUserSocketId(socketId: string, userId: string) {
    const socketIds = userIdToSocketIdsMap[userId] || [];
    const i = socketIds.indexOf(socketId);

    if (i === -1) {
      return;
    }

    socketIds.splice(i, 1);

    if (socketIds.length <= 0) {
      delete userIdToSocketIdsMap[userId];
    } else {
      userIdToSocketIdsMap[userId] = socketIds;
    }
  }

  public assertSocket(instData: ISocketContextInstanceData) {
    if (!instData.socket) {
      throw new InvalidRequestError();
    }

    return true;
  }
}
