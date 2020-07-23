import { Server, Socket } from "socket.io";
import { InvalidRequestError } from "../errors";

export interface ISocketContextInstanceData {
  socket?: Socket;
}

export interface ISocketContext {
  assertSocket: (instData: ISocketContextInstanceData) => boolean;
}

export default class SocketContext implements ISocketContext {
  public assertSocket(instData: ISocketContextInstanceData) {
    if (!instData.socket) {
      throw new InvalidRequestError();
    }

    return true;
  }
}
