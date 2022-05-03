import { IBaseContext } from "./IBaseContext";

export interface ISocketRoom {
  name: string;
  socketIds: Record<string, 1>;
  lastBroadcastTimestamp: number;

  // for rooms where we don't want to have a separate subscribed
  // sockets list if another room would have an identical list.
  // e.g board and board--tasks.
  useSocketIdsFromRoom: string | null;

  // to delete these rooms when the room is deleted
  roomsUsingSocketIdsFromRoom: Record<string, 1>;
}

export interface ISocketRoomContext {
  addToRoom: (
    roomName: string,
    socketId: string,
    roomCreationOptions?: {
      useSocketIdsFromRoom?: string;
    }
  ) => void;
  removeFromRoom: (roomName: string, socketId: string) => void;
  broadcastToRoom: (
    ctx: IBaseContext,
    roomName: string,
    event: string,
    data: any,
    skipSocketId?: string
  ) => void;
  getRoom: (roomName: string) => ISocketRoom | null;
}

export class SocketRoomContext implements ISocketRoomContext {
  rooms: Record<string, ISocketRoom> = {};

  addToRoom(
    roomName: string,
    socketId: string,
    roomCreationOptions?: {
      useSocketIdsFromRoom?: string;
    }
  ) {
    if (
      roomCreationOptions?.useSocketIdsFromRoom &&
      !this.rooms[roomCreationOptions.useSocketIdsFromRoom]
    ) {
      this.internalAddRoom(roomCreationOptions.useSocketIdsFromRoom);
    }

    this.internalAddRoom(roomName, roomCreationOptions);

    if (roomCreationOptions?.useSocketIdsFromRoom) {
      this.rooms[
        roomCreationOptions.useSocketIdsFromRoom
      ].roomsUsingSocketIdsFromRoom[roomName] = 1;

      this.internalAddSocketToRoom(
        roomCreationOptions.useSocketIdsFromRoom,
        socketId
      );
    } else {
      this.internalAddSocketToRoom(roomName, socketId);
    }
  }

  removeFromRoom(roomName: string, socketId: string) {
    delete this.rooms[roomName]?.socketIds[socketId];
  }

  broadcastToRoom(
    ctx: IBaseContext,
    roomName: string,
    event: string,
    data: any,
    skipSocketId: string
  ) {
    const room = this.rooms[roomName];
    const removeSocketIds: string[] = [];

    if (
      !room ||
      (room.useSocketIdsFromRoom && !this.rooms[room.useSocketIdsFromRoom])
    ) {
      return;
    }

    const socketIds = room.useSocketIdsFromRoom
      ? this.rooms[room.useSocketIdsFromRoom].socketIds
      : room.socketIds;

    for (const socketId in socketIds) {
      if (skipSocketId && skipSocketId === socketId) {
        continue;
      }

      const socket = ctx.socketMap.getSocket(socketId);

      if (!socket) {
        removeSocketIds.push(socketId);
      } else {
        socket.socket.emit(event, data);
      }
    }

    removeSocketIds.forEach((id) => {
      delete socketIds[id];
    });

    if (Object.keys(socketIds).length === 0) {
      this.internalRemoveRoom(
        room.useSocketIdsFromRoom ? room.useSocketIdsFromRoom : room.name
      );
    } else {
      this.internalUpdateRoom(roomName, {
        lastBroadcastTimestamp: Date.now(),
      });
    }
  }

  getRoom(roomName: string) {
    return this.rooms[roomName];
  }

  private internalAddRoom(
    roomName: string,
    roomCreationOptions?: {
      useSocketIdsFromRoom?: string;
    }
  ) {
    if (!this.rooms[roomName]) {
      this.rooms[roomName] = {
        name: roomName,
        socketIds: {},
        lastBroadcastTimestamp: Date.now(),
        useSocketIdsFromRoom: roomCreationOptions?.useSocketIdsFromRoom,
        roomsUsingSocketIdsFromRoom: {},
      };
    }
  }

  private internalAddSocketToRoom(roomName: string, socketId: string) {
    if (this.rooms[roomName]) {
      this.rooms[roomName].socketIds[socketId] = 1;
    }
  }

  private internalRemoveRoom(roomName: string) {
    const room = this.rooms[roomName];

    if (!room) {
      return;
    }

    delete this.rooms[roomName];
    Object.keys(room.roomsUsingSocketIdsFromRoom).forEach((name) =>
      this.internalRemoveRoom(name)
    );
  }

  private internalUpdateRoom(roomName: string, update: Partial<ISocketRoom>) {
    const room = this.rooms[roomName];

    if (!room) {
      return;
    }

    this.rooms[roomName] = { ...room, ...update };
  }
}
