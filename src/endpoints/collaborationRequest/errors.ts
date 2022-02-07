import OperationError from "../../utilities/OperationError";

// tslint:disable-next-line: max-classes-per-file
export class CollaboratorExistsError extends OperationError {
    public name = "CollaboratorExistsError";
    public message = "Collaborator exists";
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestExistsError extends OperationError {
    public name = "CollaborationRequestExistsError";
    public message = "Collaboration request exists";
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestDoesNotExistError extends OperationError {
    public name = "CollaborationRequestDoesNotExistError";
    public message = "Collaboration request does not exist";
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestHasExpiredError extends OperationError {
    public name = "CollaborationRequestHasExpiredError";
    public message = "Collaboration request has expired";
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestAcceptedError extends OperationError {
    public name = "CollaborationRequestAcceptedError";
    public message = "Collaboration request has been accepted";
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestDeclinedError extends OperationError {
    public name = "CollaborationRequestDeclinedError";
    public message = "Collaboration request has been declined";
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestRevokedError extends OperationError {
    public name = "CollaborationRequestRevokedError";
    public message = "Collaboration request has been revoked";
}
