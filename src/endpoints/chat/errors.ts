import OperationError from "../../utilities/OperationError";

// tslint:disable-next-line: max-classes-per-file
export class NoRoomOrRecipientProvidedError extends OperationError {
    public name = "NoRoomOrRecipientProvidedError";
    public message =
        "A room or recipient must be provided when sending message";
}

// tslint:disable-next-line: max-classes-per-file
export class RoomDoesNotExistError extends OperationError {
    public name = "RoomDoesNotExistError";
    public message = "Room does not exist";
}
