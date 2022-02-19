import OperationError from "../../utilities/OperationError";

export class SocketOnlyEndpointError extends OperationError {
    public name = "SocketOnlyEndpointError";
    public message = "Requested endpoint is a socket-only endpoint.";
}

export class NoSocketConnectionError extends OperationError {
    public name = "NoSocketConnectionError";
    public message = "Socket connection not found.";
}
