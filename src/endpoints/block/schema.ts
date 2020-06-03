const blockSchema = `
  type Assignee {
    userId: String
    assignedBy: String
    assignedAt: Float
  }

  input AssigneeInput {
    userId: String!
    assignedBy: String
    assignedAt: Float
  }

  type SubTask {
    customId: String
    description: String
    createdAt: String
    createdBy: String
    updatedAt: String
    updatedBy: String
    completedBy: String
    completedAt: String
  }

  input SubTaskInput {
    customId: String!
    description: String!
    createdAt: String!
    createdBy: String!
    updatedAt: String
    updatedBy: String
    completedBy: String
    completedAt: String
  }

  type Status {
    customId: String
    name: String
    description: String
    color: String
    createdBy: String
    createdAt: Float
    updatedBy: String
    updatedAt: Float
  }

  input StatusInput {
    customId: String!
    name: String!
    color: String!
    createdBy: String!
    createdAt: Float!
    description: String
    updatedBy: String
    updatedAt: Float
  }

  type Label {
    customId: String
    name: String
    color: String
    description: String
    createdBy: String
    createdAt: Float
    updatedBy: String
    updatedAt: Float
  }

  input LabelInput {
    customId: String!
    name: String!
    color: String!
    createdBy: String!
    createdAt: Float!
    description: String
    updatedBy: String
    updatedAt: Float
  }

  type BlockAssignedLabel {
    customId: String
    assignedBy: String
    assignedAt: String
  }

  input BlockAssignedLabelInput {
    customId: String
    assignedBy: String
    assignedAt: String
  }

  type Block {
    customId: String
    createdBy: String
    createdAt: String
    type: String
    name: String
    description: String
    dueAt: String
    color: String
    updatedAt: String
    updatedBy: String
    parent: String
    rootBlockId: String
    assignees: [Assignee]
    priority: String
    subTasks: [SubTask]
    boardStatuses: [Status]
    boardLabels: [Label]
    status: String
    statusAssignedBy: String
    statusAssignedAt: String
    labels: [BlockAssignedLabel]
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
    customId: String
    type: String
    name: String
    description: String
    dueAt: String
    color: String
    parent: String
    rootBlockId: String
    assignees: [AssigneeInput]
    priority: String
    subTasks: [SubTaskInput]
    boardStatuses: [StatusInput]
    boardLabels: [LabelInput]
    status: String
    statusAssignedBy: String
    statusAssignedAt: String
    labels: [BlockAssignedLabelInput]
  }

  input UpdateBlockInput {
    name: String
    description: String
    color: String
    priority: String
    parent: String
    subTasks: [SubTaskInput]
    boardStatuses: [StatusInput]
    boardLabels: [LabelInput]
    dueAt: String
    assignees: [AssigneeInput]
    status: String
    statusAssignedBy: String
    statusAssignedAt: String
    labels: [BlockAssignedLabelInput]
  }

  type CollaborationRequestFrom {
    userId: String
    name: String
    blockId: String
    blockName: String
    blockType: String
  }

  type NotificationTo {
    email: String
  }

  type NotificationStatusHistory {
    status: String
    date: Float
  }

  type NotificationSentEmailHistory {
    date: Float
  }

  type Notification {
    customId: String
    from: CollaborationRequestFrom
    createdAt: Float
    body: String
    readAt: Float
    to: NotificationTo
    expiresAt: String
    statusHistory: [NotificationStatusHistory]
    sentEmailHistory: [NotificationSentEmailHistory]
    type: String
    root: String
  }

  type GetNotificationsResponse {
    errors: [Error]
    notifications: [Notification]
  }

  type Collaborator {
    customId: String
    name: String
    email: String
    color: String
  }

  type GetBlockCollaboratorsResponse {
    errors: [Error]
    collaborators: [Collaborator]
  }

  input AddCollaboratorInput {
    email: String!
    customId: String!
    body: String
    expiresAt: Float
  }

  type BlockQuery {
    addBlock (block: AddBlockInput!) : ErrorOnlyResponse
    updateBlock (
      blockId: String!,
      data: UpdateBlockInput!
    ) : ErrorOnlyResponse
    deleteBlock (blockId: String!) : ErrorOnlyResponse
    getUserRootBlocks: MultipleBlocksOpResponse
    getBlockChildren (
      blockId: String!,
      typeList: [String!],
    ) : MultipleBlocksOpResponse
    addCollaborators (
      blockId: String!,
      collaborators: [AddCollaboratorInput!]!,
    ) : ErrorOnlyResponse
    removeCollaborator (
      blockId: String!,
      collaboratorId: String!
    ) : ErrorOnlyResponse
    getBlockCollaborators (blockId: String!) : GetBlockCollaboratorsResponse
    getBlockNotifications(blockId: String!) : GetNotificationsResponse
    revokeCollaborationRequest (blockId: String!, requestId: String!) : ErrorOnlyResponse
    transferBlock (
      draggedBlockId: String!,
      destinationBlockId: String!,
    ): ErrorOnlyResponse
  }
`;

export default blockSchema;
