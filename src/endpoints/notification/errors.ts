import OperationError, {
  IOperationErrorParameters,
} from "../../utilities/OperationError";

// tslint:disable-next-line: max-classes-per-file
export class NotificationDoesNotExistError extends OperationError {
  public name = "NotificationDoesNotExistError";
  public message = "Notification does not exist";
}
