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
    assignedAt: Number
  }

  input BlockTaskCollaboratorDataInput {
    userId: String!
    data: String
    addedAt: Float
    assignedBy: String
    assignedAt: Number
  }

  type AclItem {
    action: String
    level: Float
  }

  input AclItemInput {
    action: String!
    level: Float!
  }

  type Role {
    role: String
    level: String
  }

  input RoleInput {
    role: String!
    level: String!
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
    taskCollaborators: [BlockCollaboratorData]
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
    permission: UserPermissionInput
    priority: String
    taskCollaborators: [BlockCollaboratorData]
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
    taskCollaborators: [BlockCollaboratorData]
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
    # permission: UserPermission
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
    permissions: [UserPermission]
  }

  type GetCollaboratorsResponse {
    error: [Error]
    collaborators: [Collaborator]
  }

  input AddCollaboratorInput {
    email: String!
    role: String!
    body: String
    expiresAt: Float
  }

  input BlockParamInput {
    id: String!
  }

  type BlockQuery {
    addBlock (block: AddBlockInput!) : ErrorOnlyResponse
    updateBlock (block: BlockParamInput!, data: UpdateBlockInput!) : ErrorOnlyResponse
    deleteBlock (block: BlockParamInput!) : ErrorOnlyResponse
    getPermissionBlocks: MultipleBlocksOpResponse
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
