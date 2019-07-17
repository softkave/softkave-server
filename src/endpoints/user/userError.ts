import OperationError from "../../utils/OperationError";

const userErrorMessages = {
  userAccessRevoked: "Your access has been revoked",
  invalidCredentials: "Invalid credentials",
  credentialsExpired: "Credentials expired",
  emailAddressNotAvailable: "Email address is not available",
  invalidEmail: "Input is not a valid email address",
  permissionDenied: "Permission denied",
  loginAgain: "Please, login again",
  userDoesNotExist: "User does not exist",
  collaboratorDoesNotExist: "Collaborator does not exist",
  invalidLoginCredentials: "Invalid email or password"
};

const userErrorFields = {
  user: "system.user",
  userAccessRevoked: "system.user.userAccessRevoked",
  invalidCredentials: "system.user.invalidCredentials",
  credentialsExpired: "system.user.credentialsExpired",
  loginAgain: "system.user.loginAgain",
  invalidLoginCredentials: "system.user.invalidLoginCredentials",
  permissionDenied: "system.user.permissionDenied",
  userDoesNotExist: "system.user.userDoesNotExist",
  emailAddressNotAvailable: "system.user.emailAddressNotAvailable",
  invalidEmail: "system.user.invalidEmail",
  collaboratorDoesNotExist: "system.user.collaboratorDoesNotExist"
};

const userError = {
  userAccessRevoked: new OperationError(
    userErrorFields.userAccessRevoked,
    userErrorMessages.userAccessRevoked
  ),

  credentialsExpired: new OperationError(
    userErrorFields.credentialsExpired,
    userErrorMessages.credentialsExpired
  ),

  loginAgain: new OperationError(
    userErrorFields.loginAgain,
    userErrorMessages.loginAgain
  ),

  permissionDenied: new OperationError(
    userErrorFields.permissionDenied,
    userErrorMessages.permissionDenied
  ),

  invalidCredentials: new OperationError(
    userErrorFields.invalidCredentials,
    userErrorMessages.invalidCredentials
  ),

  userDoesNotExist: new OperationError(
    userErrorFields.userDoesNotExist,
    userErrorMessages.userDoesNotExist
  ),

  invalidLoginCredentials: new OperationError(
    userErrorFields.invalidLoginCredentials,
    userErrorMessages.invalidLoginCredentials
  ),

  emailAddressNotAvailable: new OperationError(
    userErrorFields.emailAddressNotAvailable,
    userErrorMessages.emailAddressNotAvailable
  ),

  collaboratorDoesNotExist: new OperationError(
    userErrorFields.collaboratorDoesNotExist,
    userErrorMessages.collaboratorDoesNotExist
  )
};

export default userError;
export { userErrorFields, userErrorMessages };
