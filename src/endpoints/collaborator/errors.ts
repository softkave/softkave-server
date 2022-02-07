import OperationError from "../../utilities/OperationError";

// tslint:disable-next-line: max-classes-per-file
export class CollaboratorDoesNotExistError extends OperationError {
    public name = "CollaboratorDoesNotExistError";
    public message = "Collaborator does not exist";
}
