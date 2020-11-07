import OperationError from "./OperationError";

export class ServerError extends OperationError {
    public name = "ServerError";
    public message = "Server error";
}

// tslint:disable-next-line: max-classes-per-file
export class InvalidInputError extends OperationError {
    public name = "InvalidInputError";
    public message = "Input is invalid";
}
