// TODO: Look at this types and ensure they are correct
const userSchema = `
  type UserRole {
    orgId: String
    assignedBy: String
    assignedAt: String
    roleName: String
  }

  input UserRoleInput {
    orgId: String
    assignedBy: String
    assignedAt: String
    roleName: String
  }

  type User {
    customId: String
    name: String
    email: String
    createdAt: Float
    lastNotificationCheckTime: Float
    color: String
    roles: [UserRole]
  }

  input UserSignupInput {
    name: String!
    email: String!
    password: String!
    color: String!
    roles: [UserRoleInput]
  }

  input UserUpdateInput {
    name: String
    lastNotificationCheckTime: Float
    roles: [UserRoleInput]
  }

  type UserQueryResult {
    user: User
    token: String
    errors: [Error]
  }

  input UpdateCollaborationRequestInput {
    readAt: Float
  }

  type UserExistsResult {
    errors: [Error]
    userExists: Boolean
  }

  type RespondToCollaborationRequestResponse {
    errors: [Error]
    block: Block
  }

  type UserQuery {
    userExists (email: String!) : UserExistsResult
    signup (user: UserSignupInput!) : UserQueryResult
    login (email: String!, password: String!) : UserQueryResult
    forgotPassword (email: String!) : ErrorOnlyResponse
    changePassword (password: String!) : UserQueryResult
    updateUser (data: UserUpdateInput!): ErrorOnlyResponse
    changePasswordWithToken (password: String!) : UserQueryResult
    getCollaborationRequests: GetCollaborationRequestsResponse
    respondToCollaborationRequest (
      customId: String!, response: String!): RespondToCollaborationRequestResponse
    updateCollaborationRequest (
      customId: String!,
      data: UpdateCollaborationRequestInput!
    ): ErrorOnlyResponse
    getUserData: UserQueryResult
  }
`;

export default userSchema;
