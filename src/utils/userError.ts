const { RequestError } = require("./error");

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
  userAccessRevoked: new RequestError(
    userErrorFields.userAccessRevoked,
    userErrorMessages.userAccessRevoked
  ),

  credentialsExpired: new RequestError(
    userErrorFields.credentialsExpired,
    userErrorMessages.credentialsExpired
  ),

  loginAgain: new RequestError(
    userErrorFields.loginAgain,
    userErrorMessages.loginAgain
  ),

  permissionDenied: new RequestError(
    userErrorFields.permissionDenied,
    userErrorMessages.permissionDenied
  ),

  invalidCredentials: new RequestError(
    userErrorFields.invalidCredentials,
    userErrorMessages.invalidCredentials
  ),

  userDoesNotExist: new RequestError(
    userErrorFields.userDoesNotExist,
    userErrorMessages.userDoesNotExist
  ),

  invalidLoginCredentials: new RequestError(
    userErrorFields.invalidLoginCredentials,
    userErrorMessages.invalidLoginCredentials
  ),

  emailAddressNotAvailable: new RequestError(
    userErrorFields.emailAddressNotAvailable,
    userErrorMessages.emailAddressNotAvailable
  ),

  collaboratorDoesNotExist: new RequestError(
    userErrorFields.collaboratorDoesNotExist,
    userErrorMessages.collaboratorDoesNotExist
  )
};

module.exports = {
  userError,
  userErrorFields,
  userErrorMessages
};
export {};
