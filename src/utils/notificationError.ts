import OperationError from "./OperationError";

const notificationErrorMessages = {
  requestDoesNotExist: "Request does not exist",
  sendRequestEmailError: "Error sending request email",
  requestHasBeenSentBefore:
    "Request has been sent before to this email address",
  sendingRequestToAnExistingCollaborator:
    "A user with this email address is already a part of this organization",
  cannotRevokeRequest:
    "Request does not exist, or has been accepted or declined"
};

const notificationErrorFields = {
  notification: "system.notification",
  requestDoesNotExist: "system.notification.requestDoesNotExist",
  sendRequestEmailError: "system.notification.sendRequestEmailError",
  requestHasBeenSentBefore: "system.notification.requestHasBeenSentBefore",
  cannotRevokeRequest: "system.notification.cannotRevokeRequest",
  sendingRequestToAnExistingCollaborator:
    "system.notification.sendingRequestToAnExistingCollaborator"
};

const notificationError = {
  requestDoesNotExist: new OperationError(
    notificationErrorFields.requestDoesNotExist,
    notificationErrorMessages.requestDoesNotExist
  ),

  sendRequestEmailError: new OperationError(
    notificationErrorFields.sendRequestEmailError,
    notificationErrorMessages.sendRequestEmailError
  ),

  requestHasBeenSentBefore: new OperationError(
    notificationErrorFields.requestHasBeenSentBefore,
    notificationErrorMessages.requestHasBeenSentBefore
  ),

  cannotRevokeRequest: new OperationError(
    notificationErrorFields.cannotRevokeRequest,
    notificationErrorMessages.cannotRevokeRequest
  )
};

export default notificationError;
export { notificationErrorFields, notificationErrorMessages };
