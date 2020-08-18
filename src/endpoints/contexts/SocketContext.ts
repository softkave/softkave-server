import { Socket } from "socket.io";
import { IUser } from "../../mongo/user";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { InvalidRequestError } from "../errors";
import { IBaseContext } from "./BaseContext";
import RequestData from "./RequestData";

interface ISocketInfo {
  clientId: string;
  socket: Socket;
}

const socketIdToUserMap: { [key: string]: IUser } = {};
const userIdToSocketsMap: {
  [key: string]: ISocketInfo[];
} = {};

export interface ISocketContext {
  assertSocket: (data: RequestData) => boolean;
  mapUserToSocketId: (data: RequestData, user: IUser) => void;
  removeSocketIdAndUser: (data: RequestData) => void;
  getUserBySocketId: (data: RequestData) => IUser | undefined;
  attachSocketToRequestData: (
    ctx: IBaseContext,
    data: RequestData,
    user: IUser
  ) => boolean;
}

export default class SocketContext implements ISocketContext {
  public assertSocket(data: RequestData) {
    if (!data.socket) {
      throw new InvalidRequestError();
    }

    return true;
  }

  public mapUserToSocketId(data: RequestData, user: IUser) {
    socketIdToUserMap[data.socket.id] = user;

    const existingSocketIndex = this.getSocketIndex(
      user.customId,
      data.socket.id
    );

    if (existingSocketIndex !== -1) {
      return;
    }

    const sockets = userIdToSocketsMap[user.customId] || [];
    sockets.push({
      clientId: data.tokenData.sub.clientId,
      socket: data.socket,
    });
    userIdToSocketsMap[user.customId] = sockets;
    console.dir({ userIdToSocketsMap, socketIdToUserMap });
  }

  public removeSocketIdAndUser(data: RequestData) {
    const user = socketIdToUserMap[data.socket.id];
    delete socketIdToUserMap[data.socket.id];

    if (!user) {
      return;
    }

    const socketIndex = this.getSocketIndex(user.customId, data.socket.id);

    if (socketIndex === -1) {
      return;
    }

    const sockets = userIdToSocketsMap[user.customId];
    sockets.splice(socketIndex, 1);
    userIdToSocketsMap[user.customId] = sockets;
    // console.dir({ userIdToSocketsMap, socketIdToUserMap });
  }

  public getUserBySocketId(data: RequestData) {
    return socketIdToUserMap[data.socket.id];
  }

  public attachSocketToRequestData(
    ctx: IBaseContext,
    data: RequestData,
    user: IUser
  ) {
    const sockets = userIdToSocketsMap[user.customId];

    if (!sockets) {
      // this, and the next should be an error, shouldn't it?
      return false;
    }

    if (sockets.length === 0) {
      // delete userIdToSocketsMap[user.customId];
      return false;
    }

    const requestClientId = data.tokenData.sub.clientId;
    const socketEntryIndex = sockets.findIndex(
      (entry) => entry.clientId === requestClientId
    );

    if (socketEntryIndex === -1) {
      return false;
    }

    const socketEntry = sockets[socketEntryIndex];
    const savedUser = socketIdToUserMap[socketEntry.socket.id];

    if (!savedUser || savedUser.customId !== user.customId) {
      delete userIdToSocketsMap[user.customId];
      sockets.forEach((entry) => delete socketIdToUserMap[entry.socket.id]);
      return false;
    }

    data.socket = socketEntry.socket;
    console.dir({ socket: socketEntry, sockets });
    return true;
  }

  private getSocketIndex(userId: string, socketId: string) {
    const sockets = userIdToSocketsMap[userId];

    if (!sockets) {
      return -1;
    }

    // if (sockets.length === 0) {
    //   delete userIdToSocketsMap[userId];
    //   return;
    // }

    const socketIndex = sockets.findIndex(
      (entry) => entry.socket.id === socketId
    );

    return socketIndex;
  }
}

export const getSocketContext = createSingletonFunc(() => new SocketContext());
