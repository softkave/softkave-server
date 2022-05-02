import OperationError from "../../utilities/OperationError";

// tslint:disable-next-line: max-classes-per-file
export class RoomDoesNotExistError extends OperationError {
  public name = "RoomDoesNotExistError";
  public message = "Room does not exist";
}
