"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notificationTypeCollaborationRequest = "collab-req";
const notificationTypeRemoveCollaborator = "remove-collaborator";
const collaborationRequestAccepted = "accepted";
const collaborationRequestDeclined = "declined";
const collaborationRequestRevoked = "revoked";
const collaborationRequestPending = "pending";
const collaborationRequestExpired = "expired";
const notificationConstants = {
    notificationTypes: {
        collaborationRequest: notificationTypeCollaborationRequest,
        removeCollaborator: notificationTypeRemoveCollaborator
    },
    notificationTypesArray: [
        notificationTypeCollaborationRequest,
        notificationTypeRemoveCollaborator
    ],
    collaborationRequestStatusTypesArray: [
        collaborationRequestAccepted,
        collaborationRequestDeclined,
        collaborationRequestRevoked,
        collaborationRequestPending,
        collaborationRequestExpired
    ],
    collaborationRequestStatusTypes: {
        accepted: collaborationRequestAccepted,
        declined: collaborationRequestDeclined,
        expired: collaborationRequestExpired,
        pending: collaborationRequestPending,
        revoked: collaborationRequestRevoked
    },
    minAddCollaboratorMessageLength: 0,
    maxAddCollaboratorMessageLength: 500
};
exports.notificationConstants = notificationConstants;
const notificationFromFieldNames = {
    userId: "userId",
    name: "name",
    blockId: "blockId",
    blockName: "blockName",
    blockType: "blockType"
};
exports.notificationFromFieldNames = notificationFromFieldNames;
const notificationToFieldNames = {
    email: "email",
    userId: "userId"
};
exports.notificationToFieldNames = notificationToFieldNames;
const notificationStatusHistoryFieldNames = {
    status: "status",
    date: "date"
};
exports.notificationStatusHistoryFieldNames = notificationStatusHistoryFieldNames;
const notificationSendEmailHistoryFieldNames = {
    date: "date"
};
exports.notificationSendEmailHistoryFieldNames = notificationSendEmailHistoryFieldNames;
const notificationFieldNames = {
    customId: "customId",
    from: "from",
    createdAt: "createdAt",
    body: "body",
    readAt: "readAt",
    to: "to",
    expiresAt: "expiresAt",
    type: "type",
    statusHistory: "statusHistory",
    sentEmailHistory: "sentEmailHistory",
    root: "root"
};
exports.notificationFieldNames = notificationFieldNames;
//# sourceMappingURL=constants.js.map