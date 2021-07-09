import OperationError from "../../utilities/OperationError";

export class OrgExistsError extends OperationError {
    public name = "OrgExistsError";
    public message = "Organization exists";
}

// tslint:disable-next-line: max-classes-per-file
export class OrgDoesNotExistError extends OperationError {
    public name = "OrgDoesNotExistError";
    public message = "Organization does not exist";
}
