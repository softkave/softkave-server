import OperationError from "utils/OperationError";

export class InvalidRequestError extends OperationError {
  public name = "InvalidRequestError";
  public message = "Request is invalid";
}

// tslint:disable-next-line: max-classes-per-file
export class PermissionDeniedError extends OperationError {
  public name = "PermissionDeniedError";
  public message = "Permission deneied";
}
