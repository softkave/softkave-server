const userSchema = `
  type User {
    customId: String
    name: String
    email: String
    createdAt: Float
    lastNotificationCheckTime: Float
    color: String
  }

  input UserSignupInput {
    name: String!
    email: String!
    password: String!
    color: String!
  }

  input UserUpdateInput {
    name: String
    lastNotificationCheckTime: Float
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

  type RCR {
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
    respondToCollaborationRequest (customId: String!, response: String!): RCR
    updateCollaborationRequest (
      customId: String!, 
      data: UpdateCollaborationRequestInput!
    ): ErrorOnlyResponse
    getUserData: UserQueryResult
  }
`;

module.exports = userSchema;
