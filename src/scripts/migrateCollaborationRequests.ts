export enum NotificationType {
    CollaborationRequest = "collab-req",
    RemoveCollaborator = "remove-collaborator",
    OrgDeleted = "org-deleted",
}

const modelName = "notification-v2";
const collectionName = "notifications-v2";

// TODO: drop older models and collections
// TODO: drop deleted blocks
// TODO: drop audit log models, and context, and code
