const userSchema = `
  type UserPermission {
    role: String
    level: Int
    assignedAt: Float
    assignedBy: String
    type: String
    blockId: String
  }

  input UserPermissionInput {
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
    permissions: [UserPermission]
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

  type UserSignupResult {
    user: User
    token: String
    errors: [Error]
    rootBlock: Block
  }

  input UpdateCollabRequestInput {
    readAt: Float
  }

  type UserQuery {
    userExists (email: String!) : Boolean
    signup (user: UserSignupInput!) : UserSignupResult
    login (user: UserLoginInput!) : UserQueryResult
    forgotPassword (email: String!) : ErrorOnlyResponse
    changePassword (password: String!) : UserQueryResult
    updateUser (data: UpdateUserInput!): ErrorOnlyResponse
    changePasswordWithToken (password: String!) : UserQueryResult
    getCollaborationRequests: GetCollabRequestsResponse
    # respondToCollaborationRequest (id: String!, response: CollaborationResponseEnum!): SingleBlockOpResponse
    updateCollaborationRequest (id: String!, data: UpdateCollabRequestInput): ErrorOnlyResponse
  }
`;

module.exports = userSchema;
