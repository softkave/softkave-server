import OperationError from "../../utilities/OperationError";
import { ServerRecommendedActions } from "../types";

export class EmailAddressNotAvailableError extends OperationError {
    public name = "EmailAddressNotAvailableError";
    public message = "Email address is not available";
}

// tslint:disable-next-line: max-classes-per-file
export class InvalidCredentialsError extends OperationError {
    public name = "InvalidCredentialsError";
    public message = "Invalid credentials";
    public action = ServerRecommendedActions.LoginAgain;
}

// tslint:disable-next-line: max-classes-per-file
export class CredentialsExpiredError extends OperationError {
    public name = "CredentialsExpiredError";
    public message = "Credentials expired";
    public action = ServerRecommendedActions.LoginAgain;
}

// tslint:disable-next-line: max-classes-per-file
export class InvalidEmailAddressError extends OperationError {
    public name = "InvalidEmailAddressError";
    public message = "Email address is invalid";
}

// tslint:disable-next-line: max-classes-per-file
export class InvalidEmailOrPasswordError extends OperationError {
    public name = "InvalidEmailOrPasswordError";
    public message = "Invalid email or password";
}

// tslint:disable-next-line: max-classes-per-file
export class LoginAgainError extends OperationError {
    public name = "LoginAgainError";
    public message = "Please login again";
    public action = ServerRecommendedActions.LoginAgain;
}

// tslint:disable-next-line: max-classes-per-file
export class UserDoesNotExistError extends OperationError {
    public name = "UserDoesNotExistError";
    public message = "User does not exist";
}

// tslint:disable-next-line: max-classes-per-file
export class CollaborationRequestDoesNotExistError extends OperationError {
    public name = "CollaborationRequestDoesNotExistError";
    public message = "Collaboration request does not exist";
}

// tslint:disable-next-line: max-classes-per-file
export class NotificationDoesNotExistError extends OperationError {
    public name = "NotificationDoesNotExistError";
    public message = "Notification does not exist";
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
