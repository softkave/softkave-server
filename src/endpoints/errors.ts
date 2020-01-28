import OperationError from "utils/OperationError";

export class InvalidRequestError extends OperationError {
  public name = "InvalidRequestError";
  public message = "Request is invalid";
}
