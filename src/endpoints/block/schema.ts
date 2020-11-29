import { getComplexTypeArrayInputGraphQLSchema } from "../utils";

const blockSchema = `
    type Assignee {
        userId: String
        assignedBy: String
        assignedAt: String
    }

    input AssigneeInput {
        userId: String
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
        description: String
        completedBy: String
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
        name: String
        color: String
        description: String
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
        name: String
        color: String
        description: String
    }

    type BlockAssignedLabel {
        customId: String
        assignedBy: String
        assignedAt: String
    }

    input BlockAssignedLabelInput {
        customId: String
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
        name: String
        description: String
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
        sprintId: String
    }

    input AddBlockInput {
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
        boardResolutions: [BoardStatusResolutionInput]
        status: String
        taskResolution: String
        labels: [BlockAssignedLabelInput]
        taskSprint: TaskSprintInput
    }

    ${getComplexTypeArrayInputGraphQLSchema(
        "UpdateBlockSubTaskInput",
        "SubTaskInput"
    )}
    ${getComplexTypeArrayInputGraphQLSchema(
        "UpdateBlockAssigneeInput",
        "AssigneeInput"
    )}
    ${getComplexTypeArrayInputGraphQLSchema(
        "UpdateBlockStatusInput",
        "StatusInput"
    )}
    ${getComplexTypeArrayInputGraphQLSchema(
        "UpdateBlockBoardStatusResolutionInput",
        "BoardStatusResolutionInput"
    )}
    ${getComplexTypeArrayInputGraphQLSchema(
        "UpdateBlockBlockAssignedLabelInput",
        "BlockAssignedLabelInput"
    )}
    ${getComplexTypeArrayInputGraphQLSchema(
        "UpdateBlockLabelInput",
        "LabelInput"
    )}

    input UpdateBlockInput {
        name: String
        description: String
        color: String
        priority: String
        parent: String
        subTasks: UpdateBlockSubTaskInput
        dueAt: String
        assignees: UpdateBlockAssigneeInput
        boardStatuses: UpdateBlockStatusInput
        boardLabels: UpdateBlockLabelInput
        boardResolutions: UpdateBlockBoardStatusResolutionInput
        status: String
        taskResolution: String
        labels: UpdateBlockBlockAssignedLabelInput
        taskSprint: TaskSprintInput
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
        ) : AddBlockResponse

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
