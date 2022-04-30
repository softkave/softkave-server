import OperationError from "./OperationError";

export class ServerError extends OperationError {
  public name = "ServerError";
  public defaultMessage = "Server error";
}

// tslint:disable-next-line: max-classes-per-file
export class InvalidInputError extends OperationError {
  public name = "InvalidInputError";
  public defaultMessage = "Input is invalid";
}

// tslint:disable-next-line: max-classes-per-file
export class IdExistsError extends OperationError {
  public name = "IdExistsError";
  public defaultMessage = "Resource ID exists";
}
