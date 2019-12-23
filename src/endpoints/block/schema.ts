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

  type LinkedBlock{
    blockId: String
    reason: String
    createdBy: String
    createdAt: Float
  }

  input LinkedBlockInput{
    blockId: String!
    reason: String
    createdBy: String!
    createdAt: Float!
  }

  type SubTask{
    customId: String
    description: String
    completedBy: String
    completedAt: Float
  }

  input SubTaskInput{
    customId: String!
    description: String!
    completedBy: String
    completedAt: Float
  }

  type AccessControl {
    orgId: String
    actionName: String
    permittedRoles: [String]
  }

  input AccessControlInput {
    orgId: String!
    actionName: String!
    permittedRoles: [String]!
  }

  type BlockRole {
    roleName: String
    createdBy: String
    createdAt: String
  }

  input BlockRoleInput {
    roleName: String
    createdBy: String
    createdAt: String
  }

  type TaskCollaborationData {
    collaborationType: String
    completedAt: Float
    completedBy: String
  }

  input TaskCollaborationDataInput {
    collaborationType: String
    completedAt: Float
    completedBy: String
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
    taskCollaborationData: TaskCollaborationData
    taskCollaborators: [BlockTaskCollaboratorData]
    linkedBlocks: [LinkedBlock]
    priority: String
    isBacklog: Boolean
    groups: [String]
    projects: [String]
    tasks: [String]
    groupTaskContext: [String]
    groupProjectContext: [String]
    # accessControl: [AccessControl]
    # roles: [BlockRole]
    subTasks: [SubTask]
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
    customId: String!
    description: String
    expectedEndAt: Float
    color: String
    type: String!
    parents: [String!]
    priority: String
    isBacklog: Boolean
    taskCollaborationData: TaskCollaborationDataInput
    taskCollaborators: [BlockTaskCollaboratorDataInput]
    linkedBlocks: [LinkedBlockInput]
    subTasks: [SubTaskInput]
    groups: [String]
    projects: [String]
    tasks: [String]
    groupTaskContext: [String]
    groupProjectContext: [String]
  }

  input UpdateBlockInput {
    name: String
    description: String
    expectedEndAt: Float
    color: String
    priority: String
    isBacklog: Boolean
    taskCollaborationData: TaskCollaborationDataInput
    taskCollaborators: [BlockTaskCollaboratorDataInput]
    parents: [String!]
    groups: [String]
    projects: [String]
    tasks: [String]
    groupTaskContext: [String]
    groupProjectContext: [String]
    linkedBlocks: [LinkedBlockInput]
    subTasks: [SubTaskInput]
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
    customId: String!
  }

  input BlockParamInput {
    customId: String!
  }

  type BlockQuery {
    addBlock (block: AddBlockInput!) : ErrorOnlyResponse
    updateBlock (
      block: BlockParamInput!,
      data: UpdateBlockInput!
    ) : ErrorOnlyResponse
    deleteBlock (block: BlockParamInput!) : ErrorOnlyResponse
    getRoleBlocks: MultipleBlocksOpResponse
    getBlocks (block: [BlockParamInput!]!) : MultipleBlocksOpResponse
    getBlockChildren (
      block: BlockParamInput!,
      types: [String!],
      isBacklog: Boolean
    ) : MultipleBlocksOpResponse
    addCollaborators (
      block: BlockParamInput!,
      collaborators: [AddCollaboratorInput!]!,
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
    transferBlock (
      sourceBlock: BlockParamInput!,
      draggedBlock: BlockParamInput!,
      destinationBlock: BlockParamInput,
      dropPosition: Float!,
      draggedBlockType: String!,
      groupContext: String
    ): ErrorOnlyResponse
    updateAccessControlData (
      block: BlockParamInput!,
      accessControlData: [AccessControlInput!]!
    ) : ErrorOnlyResponse
    # updateRoles (
    #  block: BlockParamInput!,
    #  roles: [String!]!
    # ) : ErrorOnlyResponse
    assignRole (
      block: BlockParamInput!,
      collaborator: String!,
      roleName: String!
    ) : ErrorOnlyResponse
    getAssignedTasks: MultipleBlocksOpResponse
    getBlocksWithCustomIDs (customIDs: [String!]!): MultipleBlocksOpResponse
  }
`;

export default blockSchema;
