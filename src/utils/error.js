class RequestError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field;
    this.name = "RequestError";
  }
}

const userAccessRevokedField = "system.userAccessRevoked";
const invalidCredentialsField = "system.invalidCredentials";
const credentialsExpiredField = "system.credentialsExpired";
const serverErrorField = "system.serverError";

const userAccessRevokedMessage = "user access revoked";
const invalidCredentialsMessage = "invalid credentials";
const credentialsExpiredMessage = "credentials expired";
const serverErrorMessage = "server error";

const userAccessRevokedError = new RequestError(
  userAccessRevokedField,
  "user access revoked"
);

const invalidCredentialsError = new RequestError(
  invalidCredentialsField,
  "invalid credentials"
);

const credentialsExpiredError = new RequestError(
  credentialsExpiredField,
  "credentials expired"
);

const serverError = new RequestError(serverErrorField, "server error");

function extractError(error) {
  if (Array.isArray(error)) {
    return error.map(({ field, message }) => ({ field, message }));
  } else {
    return {
      field: error.field,
      message: error.message
    };
  }
}

module.exports = {
  RequestError,
  userAccessRevokedField,
  invalidCredentialsField,
  credentialsExpiredField,
  serverErrorField,
  userAccessRevokedMessage,
  invalidCredentialsMessage,
  credentialsExpiredMessage,
  serverErrorMessage,
  userAccessRevokedError,
  invalidCredentialsError,
  credentialsExpiredError,
  serverError,
  extractError
};
