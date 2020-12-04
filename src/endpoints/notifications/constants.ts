import { SystemResourceType } from "../../models/system";

const subscriptionResourceTypes = [
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
    (Team = "team"),
    (Role = "role"),
    (Permission = "permission"),
];

export const notificationConstants = {
    maxAddCollaboratorMessageLength: 500,
    maxMarkNotificationsReadNum: 200,
};
