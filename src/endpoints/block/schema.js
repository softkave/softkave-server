const blockSchema = `
  type BlockTaskCollaboratorData {
    userId: String
    completedAt: Float
    assignedBy: String
    assignedAt: Float
  }

  input BlockTaskCollaboratorDataInput {
    userId: String!
    completedAt: Float
    assignedBy: String
    assignedAt: Float
  }

  type Block {
    customId: String
    name: String
    description: String
    expectedEndAt: Float
    createdAt: Float
    color: String
    updatedAt: Float
    type: String
    parents: [String]
    createdBy: String
    taskCollaborators: [BlockTaskCollaboratorData]
    priority: String
    position: Integer
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
    customId: String
    description: String
    expectedEndAt: Float
    color: String
    type: String!
    parents: [String!]
    priority: String
    taskCollaborators: [BlockTaskCollaboratorDataInput]
    position: Integer
  }

  input UpdateBlockInput {
    name: String
    description: String
    expectedEndAt: Float
    color: String
    priority: String
    taskCollaborators: [BlockTaskCollaboratorDataInput]
    position: Integer
    parents: [String!]
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

  type CollabRequestStatusHistory {
    status: String
    date: Float
  }

  type CollabRequestEmailHistory {
    date: Float
  }

  type CollabRequest {
    customId: String
    from: CollabRequestFrom
    createdAt: Float
    body: String
    readAt: Float
    to: CollabRequestTo
    statusHistory: [CollabRequestStatusHistory]
    sentEmailHistory: [CollabRequestEmailHistory]
    type: String
    root: String
  }

  type GetCollaborationRequestsResponse {
    errors: [Error]
    requests: [CollabRequest]
  }

  type Collaborator {
    customId: String
    name: String
    email: String
  }

  type GetCollaboratorsResponse {
    errors: [Error]
    collaborators: [Collaborator]
  }

  input AddCollaboratorInput {
    email: String!
    body: String
    expiresAt: Float
    customId: String
  }

  input BlockParamInput {
    customId: String
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
      # body: String,
      # expiresAt: Float
    ) : ErrorOnlyResponse
    removeCollaborator (
      block: BlockParamInput!, 
      collaborator: String!
    ) : ErrorOnlyResponse
    getCollaborators (block: BlockParamInput!) : GetCollaboratorsResponse
    getCollabRequests (block: BlockParamInput!) : GetCollaborationRequestsResponse
    toggleTask (block: BlockParamInput!, data: Boolean!) : ErrorOnlyResponse
    revokeRequest (block: BlockParamInput!, request: String!) : ErrorOnlyResponse
    createRootBlock: SingleBlockOpResponse
  }
`;

module.exports = blockSchema;
