import OperationError from "../../utilities/OperationError";

// tslint:disable-next-line: max-classes-per-file
export class TokenDoesNotExistError extends OperationError {
    public name = "TokenDoesNotExistError";
    public message = "Token does not exist";
}
