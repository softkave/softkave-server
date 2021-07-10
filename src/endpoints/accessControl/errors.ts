import OperationError from "../../utilities/OperationError";

export class DuplicatePermissionGroupNameError extends OperationError {
    public message = "Permission group with same name exists";
    public name = "DuplicatePermissionGroupNameError";
}
