import { AuditLogResourceType } from "../../mongo/audit-log";
import { IBlock } from "../../mongo/block";
import { INote } from "../../mongo/note";
import { IUser } from "../../mongo/user";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { IBaseContext } from "./BaseContext";
import RequestData from "./RequestData";

export interface IRoomContext {
  // saveUserSocketId: (socket: Socket, userId: string) => void;
  // getUserSocketIds: (userId: string) => string[];
  // removeUserSocketId: (socket: Socket, userId: string) => void;

  // // TODO: using socket for broadcast could cause problems, like
  // // if the socket does not exist, it'll push the new data to the client
  // // where the update is comming from, and we don't want that
  // broadcastToUserClients: (
  //   server: Server,
  //   userId: string,
  //   event: string,
  //   data: any,
  //   fromSocket?: Socket
  // ) => void;

  // subscribeToBlock: (socket: Socket, block: IBlock) => void;
  // subscribeToNote: (socket: Socket, note: INote) => void;
  // leaveBlock: (socket: Socket, block: IBlock) => void;
  // leaveNote: (socket: Socket, note: INote) => void;
  // broadcastInBlock: (
  //   server: Server,
  //   block: IBlock,
  //   event: string,
  //   data: any,
  //   fromSocket?: Socket
  // ) => void;

  subscribe: (data: RequestData, roomName: string) => void;
  leave: (data: RequestData, roomName: string) => void;
  broadcast: (
    ctx: IBaseContext,
    roomName: string,
    eventName: string,
    eventData: any,
    data?: RequestData
  ) => Promise<any>;
  getUserPersonalRoomName: (user: IUser) => string;
  getBlockRoomName: (block: IBlock) => string;
  getNoteRoomName: (note: INote) => string;
}

// TODO: write a test to see if making the internal object an array and looping through it is faster
// const rooms: { [key: string]: { [key: string]: boolean } } = {};

// function joinRoom(roomName: string, socketId: string) {
//   const room = rooms[roomName] || {};
//   room[socketId] = true;
//   rooms[roomName] = room;
// }

// function leaveRoom(roomName: string, socketId: string) {
//   const room = rooms[roomName] || {};
//   delete room[socketId];
//   rooms[roomName] = room;
// }

// function broadcast(
//   roomName: string,
//   eventId: string,
//   data: any,
//   io: Server,
//   fromSocket?: Socket
// ) {
//   const room = rooms[roomName] || {};
//   const omit = {};

//   if (fromSocket) {
//     omit[fromSocket.id] = true;
//   }

//   for (const socketId in room) {
//     // TODO: write a test to see if === comparison is faster than object comparison
//     if (omit[socketId]) {
//       continue;
//     }

//     const socket = io.to(socketId);

//     if (!socket) {
//       // TODO: log
//       delete room[socketId];
//       continue;
//     }

//     socket.emit(eventId, data);
//   }
// }

// function getRoomSubscribers(roomName: string): string[] {
//   return Object.keys(rooms[roomName] || {});
// }

export default class RoomContext implements IRoomContext {
  // public saveUserSocketId(socket: Socket, userId: string) {
  //   joinRoom(userId, socket.id);
  // }

  // public getUserSocketIds(userId: string) {
  //   return getRoomSubscribers(userId);
  // }

  // public removeUserSocketId(socket: Socket, userId: string) {
  //   leaveRoom(userId, socket.id);
  // }

  // public broadcastToUserClients(
  //   server: Server,
  //   userId: string,
  //   event: string,
  //   data: any,
  //   fromSocket?: Socket
  // ) {
  //   broadcast(userId, event, data, server, fromSocket);
  // }

  // public subscribeToBlock(socket: Socket, block: IBlock) {
  //   const roomName = `${block.type}-${block.customId}`;
  //   joinRoom(roomName, socket.id);
  // }

  // public subscribeToNote(socket: Socket, note: INote) {
  //   const roomName = `${AuditLogResourceType.Note}-${note.customId}`;
  //   joinRoom(roomName, socket.id);
  // }

  // public leaveBlock(socket: Socket, block: IBlock) {
  //   const roomName = `${block.type}-${block.customId}`;
  //   leaveRoom(roomName, socket.id);
  // }

  // public leaveNote(socket: Socket, note: INote) {
  //   const roomName = `${AuditLogResourceType.Note}-${note.customId}`;
  //   leaveRoom(roomName, socket.id);
  // }

  // public broadcastInBlock(
  //   server: Server,
  //   block: IBlock,
  //   event: string,
  //   data: any,
  //   fromSocket?: Socket
  // ) {
  //   const roomName = `${block.type}-${block.customId}`;
  //   broadcast(roomName, event, data, server, fromSocket);
  // }

  public subscribe(data: RequestData, roomName: string) {
    if (data.socket) {
      data.socket.join(roomName);
    }
  }

  public leave(data: RequestData, roomName: string) {
    if (data.socket) {
      data.socket.leave(roomName);
    }
  }

  public broadcast(
    ctx: IBaseContext,
    roomName: string,
    eventName: string,
    eventData: any,
    data: RequestData
  ) {
    return new Promise((resolve, reject) => {
      if (data.socket) {
        data.socket.to(roomName).emit(eventName, eventData, (ack) => {
          resolve(ack);
        });
      } else {
        ctx.socketServer.to(roomName).emit(eventName, eventData, (ack) => {
          resolve(ack);
        });
      }
    });
  }

  public getUserPersonalRoomName(user: IUser) {
    return `${AuditLogResourceType.User}-${user.customId}`;
  }

  public getBlockRoomName(block: IBlock) {
    return `${block.type}-${block.customId}`;
  }

  public getNoteRoomName(note: INote) {
    return `${AuditLogResourceType.Note}-${note.customId}`;
  }
}

export const getRoomContext = createSingletonFunc(() => new RoomContext());
