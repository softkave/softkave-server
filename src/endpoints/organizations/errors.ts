import OperationError from "../../utilities/OperationError";

export class OrganizationExistsError extends OperationError {
    public name = "OrganizationExistsError";
    public message = "Organization exists";
}

// tslint:disable-next-line: max-classes-per-file
export class OrganizationDoesNotExistError extends OperationError {
    public name = "OrganizationDoesNotExistError";
    public message = "Organization does not exist";
}
