const userSchema = `
    type UserOrg {
        customId: String
    }

    type User {
        customId: String
        name: String
        email: String
        createdAt: String
        rootBlockId: String
        orgs: [UserOrg]
        color: String
        notificationsLastCheckedAt: String
    }

    input UserSignupInput {
        name: String!
        email: String!
        password: String!
        color: String!
    }

    input UserUpdateInput {
        name: String
        notificationsLastCheckedAt: String
        color: String
        email: String
    }

    type Client {
        clientId: String
        hasUserSeenNotificationsPermissionDialog: Boolean
        muteChatNotifications: Boolean
        isSubcribedToPushNotifications: Boolean
        isLoggedIn: Boolean
    }

    type UserQueryResult {
        user: User
        token: String
        client: Client
        errors: [Error]
    }

    type UserExistsResult {
        errors: [Error]
        exists: Boolean
    }

    type RespondToCollaborationRequestResponse {
        errors: [Error]
        block: Block
        respondedAt: String
    }

    input UpdateClientDataInput {
        hasUserSeenNotificationsPermissionDialog: Boolean
        muteChatNotifications: Boolean
        isSubcribedToPushNotifications: Boolean
        isLoggedIn: Boolean
    }

    type UpdateClientResponse {
        errors: [Error]
        client: Client
    }

    type UserQuery {
        userExists (email: String!) : UserExistsResult
        signup (user: UserSignupInput!) : UserQueryResult
        login (email: String!, password: String!) : UserQueryResult
        forgotPassword (email: String!) : ErrorOnlyResponse
        changePassword (
            currentPassword: String!, 
            password: String!
        ) : UserQueryResult
        updateUser (data: UserUpdateInput!): UserQueryResult
        changePasswordWithToken (password: String!) : UserQueryResult
        getUserNotifications: GetNotificationsResponse
        respondToCollaborationRequest (
            requestId: String!, 
            response: String!
        ): RespondToCollaborationRequestResponse
        markNotificationRead (
            notificationId: String!,
            readAt: String!
        ): ErrorOnlyResponse
        getUserData: UserQueryResult
        updateClient (data: UpdateClientDataInput!) : UpdateClientResponse
    }
`;

export default userSchema;
