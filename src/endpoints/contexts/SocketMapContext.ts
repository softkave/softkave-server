import { Socket } from "socket.io";

export interface ISocketDetails {
    socket: Socket;
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
    getSocket: (id: string) => ISocketDetails | null;
    removeSocket: (id: string) => void;

    // inserts a socket using the id. If the socket exists,
    // merge the data.
    addSocket: (socketDetails: ISocketDetails) => void;
    updateSocketDetails: (
        id: string,
        socketDetails: Partial<ISocketDetails>
    ) => void;
}

export class SocketMapContext implements ISocketMapContext {
    sockets: Record<string, ISocketDetails>;

    getSocket(id: string) {
        return this.sockets[id];
    }

    removeSocket(id: string) {
        delete this.sockets[id];
    }

    addSocket(socketDetails: ISocketDetails) {
        this.sockets[socketDetails.socket.id] = socketDetails;
    }

    updateSocketDetails(id: string, socketDetails: Partial<ISocketDetails>) {
        if (this.sockets[id]) {
            this.sockets[id] = { ...this.sockets[id], ...socketDetails };
        }
    }
}
