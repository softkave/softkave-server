const blockSchema = `
  type BlockData {
    dataType: String
    data: String
  }

  input BlockDataInput {
    dataType: String!
    data: String!
  }

  type BlockTaskCollaboratorData {
    userId: String
    data: String
    addedAt: Float
    assignedBy: String
    assignedAt: Float
  }

  input BlockTaskCollaboratorDataInput {
    userId: String!
    data: String
    addedAt: Float
    assignedBy: String
    assignedAt: Float
  }

  type AclItem {
    action: String
    roles: [String]
  }

  input AclItemInput {
    action: String!
    roles: [String]
  }

  type Role {
    role: String
    hierarchy: Float
  }

  input RoleInput {
    role: String!
    hierarchy: Float!
  }

  type Block {
    _id: String
    id: String
    name: String
    description: String
    expectedEndAt: Float
    completedAt: Float
    createdAt: Float
    color: String
    updatedAt: Float
    type: String
    parents: [String]
    data: [BlockData]
    createdBy: String
    # owner: String
    taskCollaborators: [BlockTaskCollaboratorData]
    acl: [AclItem]
    roles: [Role]
    priority: String
  }

  type BlockResponse {
    block: Block
  }

  type SingleBlockOpResponse {
    errors: [Error]
    block: Block
  }

  type MultipleBlocksOpResponse {
    errors: [Error]
    blocks: [Block]
  }

  input AddBlockInput {
    name: String
    id: String
    description: String
    expectedEndAt: Float
    completedAt: Float
    color: String
    type: String!
    parents: [String!]
    data: [BlockDataInput!]
    acl: [AclItemInput!]
    roles: [RoleInput!]
    role: UserRoleInput
    priority: String
    taskCollaborators: [BlockTaskCollaboratorDataInput]
  }

  input UpdateBlockInput {
    name: String
    description: String
    expectedEndAt: Float
    completedAt: Float
    color: String
    priority: String
    #updatedAt: Float
    #parents: [String]
    data: [BlockDataInput]
    acl: [AclItemInput]
    roles: [RoleInput]
    taskCollaborators: [BlockTaskCollaboratorDataInput]
  }

  type CollabRequestFrom {
    userId: String
    name: String
    blockId: String
    blockName: String
    blockType: String
  }

  type CollabRequestTo {
    email: String
    userId: String
  }

  type CollabRequest {
    _id: String
    id: String
    from: [CollabRequestFrom]
    createdAt: Float
    body: String
    readAt: Float
    to: [CollabRequestTo],
    response: String,
    respondedAt: Float,
    type: String,
    # role: UserRole
  }

  type GetCollabRequestsResponse {
    errors: [Error]
    requests: [CollabRequest]
  }

  type Collaborator {
    _id: String
    id: String
    name: String
    email: String
    roles: [UserRole]
  }

  type GetCollaboratorsResponse {
    error: [Error]
    collaborators: [Collaborator]
  }

  input AddCollaboratorInput {
    email: String!
    body: String
    expiresAt: Float
    id: String!
  }

  input BlockParamInput {
    id: String!
  }

  type BlockQuery {
    addBlock (block: AddBlockInput!) : ErrorOnlyResponse
    updateBlock (block: BlockParamInput!, data: UpdateBlockInput!) : ErrorOnlyResponse
    deleteBlock (block: BlockParamInput!) : ErrorOnlyResponse
    getRoleBlocks: MultipleBlocksOpResponse
    getBlocks (block: [BlockParamInput!]!) : MultipleBlocksOpResponse
    getBlockChildren (block: BlockParamInput!, types: [String!]) : MultipleBlocksOpResponse
    addCollaborators (
      block: BlockParamInput!, 
      collaborators: [AddCollaboratorInput!]!,
      body: String,
      expiresAt: Float
    ) : ErrorOnlyResponse
    removeCollaborator (
      block: BlockParamInput!, 
      collaborator: String!
    ) : ErrorOnlyResponse
    getCollaborators (block: BlockParamInput!) : GetCollaboratorsResponse
    getCollabRequests (block: BlockParamInput!) : GetCollabRequestsResponse
    toggleTask (block: BlockParamInput!, data: Boolean!) : ErrorOnlyResponse
    updateRoles (block: BlockParamInput!, roles: [RoleInput!]!) : ErrorOnlyResponse
    updateAcl (block: BlockParamInput!, acl: [AclItemInput!]!) : ErrorOnlyResponse
    assignRole (block: BlockParamInput!, collaborator: String!, role: RoleInput!) : ErrorOnlyResponse
    revokeRequest (block: BlockParamInput!, request: String!) : ErrorOnlyResponse
    # assignTask
    # unassignTask
  }
`;

module.exports = blockSchema;