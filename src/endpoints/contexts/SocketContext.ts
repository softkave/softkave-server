import { Socket } from "socket.io";
import { AuditLogResourceType } from "../../mongo/audit-log";
import SocketServer from "../../sockets/socket";
import { IServerRequest } from "../../utilities/types";

export interface ISocketContextStaticData {
  socketServer: SocketServer;
}

export interface ISocketContextInstanceData {
  socket?: Socket;
}

export interface ISocketContext {
  // checkSocket: (socket?: Socket) => socket is Socket;
  subscribeToRoom: (
    staticData: ISocketContextStaticData,
    instData: ISocketContextInstanceData,
    userId: string,
    resourceType: AuditLogResourceType,
    resourceId: string
  ) => void;
}

export default class SocketContext implements ISocketContext {
  public subscribeToRoom(
    staticData: ISocketContextStaticData,
    instData: ISocketContextInstanceData,
    userId: string,
    resourceType: AuditLogResourceType,
    resourceId: string
  ) {
    if (!instData.socket) {
      return;
      // throw error;
    }

    instData.socket.join(`${resourceType}-${resourceId}`);
  }
}
