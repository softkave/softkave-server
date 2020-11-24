const blockSchema = `
    type Assignee {
        userId: String
        assignedBy: String
        assignedAt: String
    }

    input AssigneeInput {
        userId: string;
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
        customId: String
        description: string;
        completedBy?: string;
    }

    type Status {
        customId: String
        name: String
        description: String
        color: String
        createdBy: String
        createdAt: String
        updatedBy: String
        updatedAt: String
    }

    input StatusInput {
        customId: String
        name: string;
        color: string;
        description?: string;
    }

    type Label {
        customId: String
        name: String
        color: String
        description: String
        createdBy: String
        createdAt: String
        updatedBy: String
        updatedAt: String
    }

    input LabelInput {
        customId: String
        name: string;
        color: string;
        description?: string;
    }

    type BlockAssignedLabel {
        customId: String
        assignedBy: String
        assignedAt: String
    }

    input BlockAssignedLabelInput {
        customId: string;
    }

    type BoardStatusResolution {
        customId: String
        name: String
        createdBy: String
        createdAt: String
        description: String
        updatedBy: String
        updatedAt: String
    }

    input BoardStatusResolutionInput {
        customId: String
        name: string;
        description?: string;
    }

    type TaskSprint {
        sprintId: String
        assignedAt: String
        assignedBy: String
    }

    type BoardSprintOptions {
        duration: String
        updatedAt: String
        updatedBy: String
        createdAt: String
        createdBy: String
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
        boardResolutions: [BoardStatusResolution]
        status: String
        statusAssignedBy: String
        statusAssignedAt: String
        taskResolution: String
        labels: [BlockAssignedLabel]
        taskSprint: TaskSprint
        currentSprintId: String
        sprintOptions: BoardSprintOptions
        lastSprintId: String
    }

    type SingleBlockOpResponse {
        errors: [Error]
        block: Block
    }

    type MultipleBlocksOpResponse {
        errors: [Error]
        blocks: [Block]
    }

    input TaskSprintInput {
        sprintId: string;
    }

    input AddBlockInput {
        type: String
        name: String
        description: String
        dueAt: Float
        color: String
        parent: String
        rootBlockId: String
        assignees: [AssigneeInput]
        priority: String
        subTasks: [SubTaskInput]
        boardStatuses: [StatusInput]
        boardLabels: [LabelInput]
        boardResolutions: [BoardStatusResolutionInput]
        status: String
        taskResolution: String
        labels: [BlockAssignedLabelInput]
        taskSprint: TaskSprintInput
    }

    input UpdateBlockInput {
        name: String
        description: String
        color: String
        priority: String
        parent: String
        subTasks: SubTaskInput
        dueAt: number
        assignees: AssigneeInput
        boardStatuses: BlockStatusInput
        boardLabels: BlockLabelInput
        boardResolutions:BoardStatusResolutionInput
        status: String
        taskResolution: String
        labels: BlockAssignedLabelInput
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
        date: String
    }

    type NotificationSentEmailHistory {
        date: String
    }

    type Notification {
        customId: String
        from: CollaborationRequestFrom
        createdAt: String
        body: String
        readAt: String
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
        expiresAt: String
    }

    type AddCollaboratorResult {
        errors: [Error]
        requests: [Notification]
    }

    type AddBlockResponse {
        errors: [Error]
        block: Block
    }

    type BlockQuery {
        addBlock (block: AddBlockInput!) : AddBlockResponse
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
        ) : AddCollaboratorResult

        removeCollaborator (
            blockId: String!,
            collaboratorId: String!
        ) : ErrorOnlyResponse

        getBlockCollaborators (blockId: String!) : GetBlockCollaboratorsResponse
        getBlockNotifications(blockId: String!) : GetNotificationsResponse
        revokeCollaborationRequest (blockId: String!, requestId: String!) : ErrorOnlyResponse
    }
`;

export default blockSchema;
