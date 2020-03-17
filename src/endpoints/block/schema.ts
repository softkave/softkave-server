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
    parent: String
    rootBlockID: String
    createdBy: String
    taskCollaborationData: TaskCollaborationData
    taskCollaborators: [BlockTaskCollaboratorData]
    priority: String
    groups: [String]
    projects: [String]
    tasks: [String]
    groupTaskContext: [String]
    groupProjectContext: [String]
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
    parent: String
    rootBlockID: String
    priority: String
    taskCollaborationData: TaskCollaborationDataInput
    taskCollaborators: [BlockTaskCollaboratorDataInput]
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
    taskCollaborationData: TaskCollaborationDataInput
    taskCollaborators: [BlockTaskCollaboratorDataInput]
    type: String!
    parent: String
    groups: [String]
    projects: [String]
    tasks: [String]
    groupTaskContext: [String]
    groupProjectContext: [String]
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

  type GetBlockLandingPageResponse {
    errors: [Error]

    # TODO: should we convert this to an enum
    page: String
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
      customId: String!,
      data: UpdateBlockInput!
    ) : ErrorOnlyResponse

    deleteBlock (customId: String!) : ErrorOnlyResponse
    getRootBlocks: MultipleBlocksOpResponse
    getBlockChildren (
      customId: String!,
      typeList: [String!]
    ) : MultipleBlocksOpResponse

    addCollaborators (
      customId: String!,
      collaborators: [AddCollaboratorInput!]!,
    ) : ErrorOnlyResponse

    removeCollaborator (
      customId: String!,
      collaborator: String!
    ) : ErrorOnlyResponse

    getBlockCollaborators (customId: String!) : GetCollaboratorsResponse
    getBlockCollaborationRequests (customId: String!) : GetCollaborationRequestsResponse

    # toggleTask (customId: String!, data: Boolean!) : ErrorOnlyResponse

    revokeCollaborationRequest (customId: String!, request: String!) : ErrorOnlyResponse
    transferBlock (
      sourceBlock: String!,
      draggedBlock: String!,
      destinationBlock: String!,
      dropPosition: Float,
      groupContext: String
    ): ErrorOnlyResponse

    getAssignedTasks: MultipleBlocksOpResponse
    getBlocksWithCustomIds (customIds: [String!]!): MultipleBlocksOpResponse
    getBlockLandingPage: (customId: String!): GetBlockLandingPageResponse
  }
`;

export default blockSchema;
