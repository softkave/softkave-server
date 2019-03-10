const userSchema = `
  type UserRole {
    role: String
    level: Int
    assignedAt: Float
    assignedBy: String
    type: String
    blockId: String
  }

  input UserRoleInput {
    role: String!
    level: Int!
  }

  type User {
    id: String
    _id: String
    name: String
    email: String
    createdAt: Float
    lastNotificationCheckTime: Float
    roles: [UserRole]
  }

  input UserSignupInput {
    name: String!
    email: String!
    password: String!
  }

  input UserLoginInput {
    email: String!
    password: String!
  }

  input UpdateUserInput {
    name: String
    lastNotificationCheckTime: Float
  }

  type UserQueryResult {
    user: User
    token: String
    errors: [Error]
  }

  input UpdateCollabRequestInput {
    readAt: Float
  }

  type UserExistsResult {
    errors: [Error]
    userExists: Boolean
  }

  type UserQuery {
    #userExists (email: String!) : UserExistsResult
    signup (user: UserSignupInput!) : UserQueryResult
    login (user: UserLoginInput!) : UserQueryResult
    forgotPassword (email: String!) : ErrorOnlyResponse
    changePassword (password: String!) : UserQueryResult
    updateUser (data: UpdateUserInput!): ErrorOnlyResponse
    changePasswordWithToken (password: String!) : UserQueryResult
    getCollaborationRequests: GetCollabRequestsResponse
    respondToCollaborationRequest (id: String!, response: String!): SingleBlockOpResponse
    updateCollaborationRequest (id: String!, data: UpdateCollabRequestInput!): ErrorOnlyResponse
  }
`;

module.exports = userSchema;