import { SystemResourceType } from "../../models/system";

const subscriptionResourceTypes = [
    SystemResourceType.Org,
    SystemResourceType.Board,
    SystemResourceType.CollaborationRequest,
    SystemResourceType.Role,
    SystemResourceType.Permission,
    SystemResourceType.Task,
    SystemResourceType.Chat,

    (User = "user"),
    (Collaborator = "collaborator"),
    (RootBlock = "root"),
    (Org = "org"),
    (Board = "board"),
    (Task = "task"),
    (Status = "status"),
    (Label = "label"),
    (Resolution = "resolution"),
    (Note = "note"),
    (Comment = "comment"),
    (Room = "room"),
    (Sprint = "sprint"),
    (Chat = "chat"),
    (SubTask = "subtask"),
    (CollaborationRequest = "collaborationRequest"),
    (Notification = "notification"),
    (Team = "team"),
    (Role = "role"),
    (Permission = "permission"),
];

export const notificationConstants = {
    maxAddCollaboratorMessageLength: 500,
};
