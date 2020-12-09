import OperationError from "../../utilities/OperationError";

export class DuplicateRoleNameError extends OperationError {
    public message = "Role with same name exists";
    public name = "DuplicateRoleNameError";
}
