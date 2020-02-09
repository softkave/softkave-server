const notificationTypeCollaborationRequest = "collab-req";
const notificationTypeRemoveCollaborator = "remove-collaborator";

const collaborationRequestAccepted = "accepted";
const collaborationRequestDeclined = "declined";
const collaborationRequestRevoked = "revoked";
const collaborationRequestPending = "pending";
const collaborationRequestExpired = "expired";

export type CollaborationRequestStatusType =
  | typeof collaborationRequestAccepted
  | typeof collaborationRequestDeclined
  | typeof collaborationRequestExpired
  | typeof collaborationRequestPending
  | typeof collaborationRequestRevoked;

export type CollaborationRequestResponse =
  | typeof collaborationRequestAccepted
  | typeof collaborationRequestDeclined;

export const notificationConstants = {
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
