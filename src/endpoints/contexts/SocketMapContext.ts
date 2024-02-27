import {IAppSocket} from './types';

export interface IConnectedSocketDetails {
  socket: IAppSocket;
  // clientId: string;
  userId: string;

  // whether the user is currently on the app or not.
  // this is currently getting tracked in db, we want to
  // move this to this object and possibly reduce the stress
  // on the db.
  isActive?: boolean;
}

export interface ISocketMapContext {
  // gets a socket by id. if the socket is disconnected
  // or does not exist, it return null.
  getSocket: (id: string) => IConnectedSocketDetails | null;
  removeSocket: (id: string) => void;

  // inserts a socket using the id. If the socket exists,
  // merge the data.
  addSocket: (socketDetails: IConnectedSocketDetails) => void;
  updateSocketDetails: (id: string, socketDetails: Partial<IConnectedSocketDetails>) => void;
}

export class SocketMapContext implements ISocketMapContext {
  sockets: Record<string, IConnectedSocketDetails> = {};

  getSocket(id: string) {
    return this.sockets[id];
  }

  removeSocket(id: string) {
    delete this.sockets[id];
  }

  addSocket(socketDetails: IConnectedSocketDetails) {
    this.sockets[socketDetails.socket.id] = socketDetails;
  }

  updateSocketDetails(id: string, socketDetails: Partial<IConnectedSocketDetails>) {
    if (this.sockets[id]) {
      this.sockets[id] = {...this.sockets[id], ...socketDetails};
    }
  }
}
