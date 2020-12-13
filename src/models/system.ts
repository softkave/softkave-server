export enum SystemResourceType {
    User = "user",
    Collaborator = "collaborator",
    RootBlock = "root",
    Org = "org",
    Board = "board",
    Task = "task",
    Status = "status",
    Label = "label",
    Resolution = "resolution",
    Note = "note",
    Comment = "comment",
    Room = "room",
    Sprint = "sprint",
    Chat = "chat",
    SubTask = "subtask",
    CollaborationRequest = "collaborationRequest",
    Notification = "notification",
    NotificationSubscription = "notificationSubscription",
    Team = "team",
    PermissionGroup = "permissionGroup",
    Permission = "permission",
}

export enum NotificationTypes {
    CollaboratorRemoved = "userRemoved",
    CollaboratorLeft = "userLeft",
}

export enum SystemActionType {
    // general
    Create = "create",
    Read = "read",
    Update = "update",
    Delete = "delete",

    // collaborator and collaboration request
    RevokeRequest = "revoke-request",
    RemoveCollaborator = "remove-user",
    RespondToRequest = "respondToRequest",

    // user
    Signup = "signup",
    Login = "login",
    ForgotPassword = "forgot-password",
    ChangePassword = "change-password",
    ChangePasswordWithToken = "change-password-with-token",
}
