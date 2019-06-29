const { RequestError } = require("./error");

const errorMessages = {
  requestDoesNotExist: "Request does not exist",
  sendRequestEmailError: "Error sending request email",
  requestHasBeenSentBefore: "Request has been sent before to this user",
  cannotRevokeRequest:
    "Request does not exist, or has been accepted or declined"
};

const errorFields = {
  notification: "system.notification",
  requestDoesNotExist: "system.notification.requestDoesNotExist",
  sendRequestEmailError: "system.notification.sendRequestEmailError",
  requestHasBeenSentBefore: "system.notification.requestHasBeenSentBefore",
  cannotRevokeRequest: "system.notification.cannotRevokeRequest"
};

const errors = {
  requestDoesNotExist: new RequestError(
    errorFields.requestDoesNotExist,
    errorMessages.requestDoesNotExist
  ),

  sendRequestEmailError: new RequestError(
    errorFields.sendRequestEmailError,
    errorMessages.sendRequestEmailError
  ),

  requestHasBeenSentBefore: new RequestError(
    errorFields.requestHasBeenSentBefore,
    errorMessages.requestHasBeenSentBefore
  ),

  cannotRevokeRequest: new RequestError(
    errorFields.cannotRevokeRequest,
    errorMessages.cannotRevokeRequest
  )
};

module.exports = {
  errors,
  errorFields,
  errorMessages
};
