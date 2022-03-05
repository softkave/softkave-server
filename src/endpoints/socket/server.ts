import { Server } from "socket.io";
import { ServerError } from "../../utilities/errors";
import { getBaseContext } from "../contexts/BaseContext";
import { IncomingSocketEvents } from "./incomingEventTypes";
import { setupSocketEndpoints } from "./setupEndpoints";

// REMINDER
// The current implementation authenticates once, then accepts all other requests
// This can be problematic in a number of ways
// Fixes include adding the user token to the header and authenticating on every request
// Problem with this is that it's only available when using polling ( which is currently the default option )
//   but this can be problematic if we decide to move to pure web sockets
// Another fix is passing the token with every request, this can work
// But if there's no possibility of exploitation with current implementation,
//   then that  wastes compute resources
// Also, what happens when the user changes their password?
// Maybe if the user changes password or auth token is changed, the socket will only auth again

// TODO: disconnect sockets that don't auth in 5 minutes

let socketServer: Server = null;

export function setSocketServer(io: Server) {
    socketServer = io;
    io.on(IncomingSocketEvents.Connection, (socket) =>
        setupSocketEndpoints(getBaseContext(), socket)
    );
}

export function getSocketServer() {
    if (!socketServer) {
        throw new ServerError();
    }

    return socketServer;
}
