const notificationTypeCollaborationRequest = "collab-req";
const notificationTypeRemoveCollaborator = "remove-collaborator";

const collaborationRequestAccepted = "accepted";
const collaborationRequestDeclined = "declined";
const collaborationRequestRevoked = "revoked";
const collaborationRequestPending = "pending";
const collaborationRequestExpired = "expired";

const constants = {
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
  }
};

const notificationFromFieldNames = {
  userId: "userId",
  name: "name",
  blockId: "blockId",
  blockName: "blockName",
  blockType: "blockType"
};

const notificationToFieldNames = {
  email: "email",
  userId: "userId"
};

const notificationStatusHistoryFieldNames = {
  status: "status",
  date: "date"
};

const notificationSendEmailHistoryFieldNames = {
  date: "date"
};

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

module.exports = {
  constants,
  notificationFieldNames,
  notificationFromFieldNames,
  notificationToFieldNames,
  notificationSendEmailHistoryFieldNames,
  notificationStatusHistoryFieldNames
};
