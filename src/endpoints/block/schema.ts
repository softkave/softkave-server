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
    customId: string;
    description: string;
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
    updatedBy?: string;
    completedBy?: string;
    completedAt?: Date;
  }

  input SubTaskInput {
    customId: string!
    description: string!
    createdAt: Date!
    createdBy: string!
    updatedAt?: Date;
    updatedBy?: string;
    completedBy?: string;
    completedAt?: Date;
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
    customId: string;
    assignedBy: string;
    assignedAt: Date;
  }

  input BlockAssignedLabelInput {
    customId: string;
    assignedBy: string;
    assignedAt: Date;
  }

  type Block {
    customId: string;
    createdBy: string;
    createdAt: Date;
    type: BlockType;
    name?: string;
    description?: string;
    dueAt?: Date;
    color?: string;
    updatedAt?: Date;
    updatedBy?: string;
    parent?: string;
    rootBlockId?: string;
    assignees?: [Assignee]
    priority?: string;
    subTasks?: [SubTask]
    boardStatuses?: [Status];
    boardLabels?: [Label];
    status?: string;
    statusAssignedBy?: string;
    statusAssignedAt?: Date;
    labels?: [BlockAssignedLabel]
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
    customId: string;
    type: BlockType;
    name?: string;
    description?: string;
    dueAt?: string;
    color?: string;
    parent?: string;
    rootBlockId?: string;
    assignees?: [AssigneeInput]
    priority?: string;
    subTasks?: [SubTaskInput]
    boardStatuses?: [StatusInput]
    boardLabels?: [LabelInput]
    status?: string;
    statusAssignedBy?: string;
    statusAssignedAt?: string;
    labels?: [BlockAssignedLabelInput]
  }

  input UpdateBlockInput {
    name?: string;
    description?: string;
    color?: string;
    priority?: string;
    parent?: string;
    subTasks?: [SubTaskInput]
    boardStatuses?: [StatusInput]
    boardLabels?: [LabelInput]
    dueAt?: Date;
    assignees?: [AssigneeInput]
    status?: string;
    statusAssignedBy?: string;
    statusAssignedAt?: Date;
    labels?: [BlockAssignedLabelInput]
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
