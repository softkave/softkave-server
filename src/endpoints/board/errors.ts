import OperationError from "../../utilities/OperationError";

export class BoardExistsError extends OperationError {
    public name = "BoardExistsError";
    public message = "Board exists";
}

// tslint:disable-next-line: max-classes-per-file
export class BoardDoesNotExistError extends OperationError {
    public name = "BoardDoesNotExistError";
    public message = "Board does not exist";
}
