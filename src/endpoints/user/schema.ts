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
  }

  type UserQueryResult {
    user: User
    token: String
    clientId: String
    errors: [Error]
  }

  type UserExistsResult {
    errors: [Error]
    exists: Boolean
  }

  type RespondToCollaborationRequestResponse {
    errors: [Error]
    block: Block
  }

  type GetChangePasswordTokenDataResult {
    errors: [Error]
    email: String
    issuedAt: String
    expires: String
  }

  type UserQuery {
    userExists (email: String!) : UserExistsResult
    signup (user: UserSignupInput!) : UserQueryResult
    login (email: String!, password: String!) : UserQueryResult
    forgotPassword (email: String!) : ErrorOnlyResponse
    changePassword (password: String!) : UserQueryResult
    updateUser (data: UserUpdateInput!): ErrorOnlyResponse
    changePasswordWithToken (password: String!) : UserQueryResult
    getUserNotifications: GetNotificationsResponse
    respondToCollaborationRequest (
      requestId: String!, response: String!): RespondToCollaborationRequestResponse
    markNotificationRead (
      notificationId: String!,
      readAt: String!
    ): ErrorOnlyResponse
    getUserData: UserQueryResult
    getChangePasswordTokenData (token: String!) : GetChangePasswordTokenDataResult
  }
`;

export default userSchema;
