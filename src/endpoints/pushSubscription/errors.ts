import OperationError from "../../utilities/OperationError";

// tslint:disable-next-line: max-classes-per-file
export class PushSubscriptionDoesNotExistError extends OperationError {
    public name = "PushSubscriptionDoesNotExistError";
    public message = "Push subscription does not exist";
}

// tslint:disable-next-line: max-classes-per-file
export class PushSubscriptionExistsError extends OperationError {
    public name = "PushSubscriptionExistsError";
    public message = "Push subscription exists";
}
