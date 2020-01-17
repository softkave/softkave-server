import OperationError from "../../utils/OperationError";
import { userErrorActions } from "./constants";

export class EmailAddressNotAvailableError extends OperationError {
  public name = "EmailAddressNotAvailable";
  public message = "This email address is not available";
}

// tslint:disable-next-line: max-classes-per-file
export class InvalidCredentialsError extends OperationError {
  public name = "InvalidCredentialsError";
  public message = "Invalid credentials";
}

// tslint:disable-next-line: max-classes-per-file
export class CredentialsExpiredError extends OperationError {
  public name = "CredentialsExpiredError";
  public message = "Credentials expired";
}

// tslint:disable-next-line: max-classes-per-file
export class InvalidEmailAddressError extends OperationError {
  public name = "InvalidEmailAddressError";
  public message = "Email address is invalid";
}

// tslint:disable-next-line: max-classes-per-file
export class LoginAgainError extends OperationError {
  public name = "LoginAgainError";
  public message = "Please login again";
  public action = userErrorActions.loginAgain;
}

// tslint:disable-next-line: max-classes-per-file
export class UserDoesNotExistError extends OperationError {
  public name = "UserDoesNotExistError";
  public message = "User does not exist";
}
