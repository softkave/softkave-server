import { Server } from "socket.io";
import { AuditLogResourceType } from "../../mongo/audit-log";
import { IBlock } from "../../mongo/block";
import { INote } from "../../mongo/note";
import { IUser } from "../../mongo/user";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { OutgoingSocketEvents } from "../socket/server";
import { IBaseContext } from "./BaseContext";
import RequestData from "./RequestData";

/**
 * RoomContext
 * RoomContext handles the joining, leaving, and broadcasting of data in rooms
 * to connected client sockets. It also provides functions to generate 'pure'
 * ( meaning the same arguments always produce the same results ) room names for
 * resource types.
 *
 * We are currently using our own rooms implementation, and not the one from
 * socket.io ( the underlying socket library we're using ), because the socket.io
 * version of rooms was inconsistent and error prone.
 */

export interface IRoomContext {
  subscribe: (data: RequestData, roomName: string) => void;
  leave: (data: RequestData, roomName: string) => void;
  broadcast: (
    ctx: IBaseContext,
    roomName: string,
    eventName: string,
    eventData: any,
    data?: RequestData
  ) => void;
  getUserPersonalRoomName: (user: IUser) => string;
  getBlockRoomName: (block: IBlock) => string;
  getNoteRoomName: (note: INote) => string;
}

// TODO: write a test to see if making the internal object an array and looping through it is faster
const rooms: { [key: string]: { [key: string]: boolean } } = {};

function joinRoom(roomName: string, socketId: string) {
  const room = rooms[roomName] || {};
  room[socketId] = true;
  rooms[roomName] = room;
}

function leaveRoom(roomName: string, socketId: string) {
  const room = rooms[roomName] || {};
  delete room[socketId];
  rooms[roomName] = room;
}

function broadcast(
  roomName: string,
  eventId: string,
  data: any,
  io: Server,
  fromSocketId?: string
) {
  const room = rooms[roomName] || {};
  const omit = {};

  if (fromSocketId) {
    omit[fromSocketId] = true;
  }

  for (const socketId in room) {
    // TODO: write a test to see if === comparison is faster than object comparison
    if (omit[socketId]) {
      continue;
    }

    const socket = io.to(socketId);

    if (!socket) {
      // TODO: log
      delete room[socketId];
      continue;
    }

    socket.emit(eventId, data);
  }
}

function getRoomSubscribers(roomName: string): string[] {
  return Object.keys(rooms[roomName] || {});
}

export default class RoomContext implements IRoomContext {
  public subscribe(data: RequestData, roomName: string) {
    if (data.socket) {
      joinRoom(roomName, data.socket.id);
    }
  }

  public leave(data: RequestData, roomName: string) {
    if (data.socket) {
      leaveRoom(roomName, data.socket.id);
    }
  }

  public broadcast(
    ctx: IBaseContext,
    roomName: string,
    eventName: OutgoingSocketEvents,
    eventData: any,
    data: RequestData
  ) {
    broadcast(
      roomName,
      eventName,
      eventData,
      ctx.socketServer,
      data.socket?.id
    );

    ctx.broadcastHistory.insert(ctx, data, roomName, {
      data: eventData,
      event: eventName,
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
