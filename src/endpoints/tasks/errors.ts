import OperationError from "../../utilities/OperationError";

export class TaskExistsError extends OperationError {
    public name = "TaskExistsError";
    public message = "Task exists";
}

// tslint:disable-next-line: max-classes-per-file
export class TaskDoesNotExistError extends OperationError {
    public name = "TaskDoesNotExistError";
    public message = "Task does not exist";
}
