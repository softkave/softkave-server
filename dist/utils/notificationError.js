"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { RequestError } = require("./error");
const notificationErrorMessages = {
    requestDoesNotExist: "Request does not exist",
    sendRequestEmailError: "Error sending request email",
    requestHasBeenSentBefore: "Request has been sent before to this email address",
    sendingRequestToAnExistingCollaborator: "User with this email address is already a part of this organization",
    cannotRevokeRequest: "Request does not exist, or has been accepted or declined"
};
exports.notificationErrorMessages = notificationErrorMessages;
const notificationErrorFields = {
    notification: "system.notification",
    requestDoesNotExist: "system.notification.requestDoesNotExist",
    sendRequestEmailError: "system.notification.sendRequestEmailError",
    requestHasBeenSentBefore: "system.notification.requestHasBeenSentBefore",
    cannotRevokeRequest: "system.notification.cannotRevokeRequest",
    sendingRequestToAnExistingCollaborator: "system.notification.sendingRequestToAnExistingCollaborator"
};
exports.notificationErrorFields = notificationErrorFields;
const notificationError = {
    requestDoesNotExist: new RequestError(notificationErrorFields.requestDoesNotExist, notificationErrorMessages.requestDoesNotExist),
    sendRequestEmailError: new RequestError(notificationErrorFields.sendRequestEmailError, notificationErrorMessages.sendRequestEmailError),
    requestHasBeenSentBefore: new RequestError(notificationErrorFields.requestHasBeenSentBefore, notificationErrorMessages.requestHasBeenSentBefore),
    cannotRevokeRequest: new RequestError(notificationErrorFields.cannotRevokeRequest, notificationErrorMessages.cannotRevokeRequest)
};
exports.default = notificationError;
//# sourceMappingURL=notificationError.js.map