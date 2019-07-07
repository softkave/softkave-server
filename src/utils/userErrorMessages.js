const { RequestError } = require("./error");

const errorMessages = {
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

const errorFields = {
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

const errors = {
  userAccessRevoked: new RequestError(
    errorFields.userAccessRevoked,
    errorMessages.userAccessRevoked
  ),

  credentialsExpired: new RequestError(
    errorFields.credentialsExpired,
    errorMessages.credentialsExpired
  ),

  loginAgain: new RequestError(
    errorFields.loginAgain,
    errorMessages.loginAgain
  ),

  permissionDenied: new RequestError(
    errorFields.permissionDenied,
    errorMessages.permissionDenied
  ),

  invalidCredentials: new RequestError(
    errorFields.invalidCredentials,
    errorMessages.invalidCredentials
  ),

  userDoesNotExist: new RequestError(
    errorFields.userDoesNotExist,
    errorMessages.userDoesNotExist
  ),

  invalidLoginCredentials: new RequestError(
    errorFields.invalidLoginCredentials,
    errorMessages.invalidLoginCredentials
  ),

  emailAddressNotAvailable: new RequestError(
    errorFields.emailAddressNotAvailable,
    errorMessages.emailAddressNotAvailable
  ),

  collaboratorDoesNotExist: new RequestError(
    errorFields.collaboratorDoesNotExist,
    errorMessages.collaboratorDoesNotExist
  )
};

module.exports = {
  errors,
  errorFields,
  errorMessages
};
