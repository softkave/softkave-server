const blockSchema = `
  type BlockData {
    dataType: String
    data: String
  }

  input BlockDataInput {
    dataType: String!
    data: String!
  }

  type BlockCollaboratorData {
    userId: String
    data: String
    addedAt: Float
  }

  input BlockCollaboratorDataInput {
    userId: String!
    data: String
    addedAt: Float
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
    collaborators: [BlockCollaboratorData]
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
    #createdAt: Float
    color: String
    type: String!
    parents: [String!]
    data: [BlockDataInput!]
    #createdBy: String
    acl: [AclItemInput!]
    roles: [RoleInput!]
    permission: UserPermissionInput
    # owner: String!
    priority: String
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
    #createdBy: String
    acl: [AclItemInput]
    roles: [RoleInput]
  }

  type CollabRequestFrom {
    userId: String
    name: String
    blockId: String
    blockName: String
  }

  type CollabRequestTo {
    email: String
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
    permission: UserPermission
  }

  type GetCollabRequestsResponse {
    errors: [Error]
    requests: [CollabRequest]
  }

  type Collaborator {
    _id: String
    name: String
    email: String
    permissions: UserPermission
  }

  type GetCollaboratorsResponse {
    error: [Error]
    collaborators: [Collaborator]
  }

  input AddCollaboratorInput {
    email: String!
    role: String!
  }

  input UpdateCollaboratorInput {
    role: String!
  }

  input BlockParamInput {
    type: String!
    # owner: String!
    id: String!
  }

  type BlockQuery {
    addBlock (block: AddBlockInput!) : SingleBlockOpResponse
    updateBlock (block: BlockParamInput!, data: UpdateBlockInput!) : SingleBlockOpResponse
    deleteBlock (block: BlockParamInput!) : ErrorOnlyResponse
    getPermissionBlocks: MultipleBlocksOpResponse
    getBlocks (block: [BlockParamInput!]!) : MultipleBlocksOpResponse
    getBlockChildren (block: BlockParamInput!, types: [String!]) : MultipleBlocksOpResponse
    addCollaborators (
      block: BlockParamInput!, 
      collaborators: [AddCollaboratorInput!]!
    ) : ErrorOnlyResponse
    # updateCollaborator (
    #   block: BlockParamInput!, 
    #   collaborator: String!, data: UpdateCollaboratorInput!
    # ) : ErrorOnlyResponse
    # removeCollaborator (
    #   block: BlockParamInput!, 
    #   collaborator: String!
    # ) : ErrorOnlyResponse
    getCollaborators (block: BlockParamInput!) : GetCollaboratorsResponse
    getCollabRequests (block: BlockParamInput!) : GetCollabRequestsResponse
    toggleTask (block: BlockParamInput!, data: Boolean!)
    updateRoles
    updateAcl
  }
`;

module.exports = blockSchema;
