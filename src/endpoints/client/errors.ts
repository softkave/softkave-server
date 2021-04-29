import OperationError from "../../utilities/OperationError";

// tslint:disable-next-line: max-classes-per-file
export class ClientDoesNotExistError extends OperationError {
    public name = "ClientDoesNotExistError";
    public message = "Client does not exist";
}
