import { BlockType, IBlock } from "../../mongo/block";
import { extractFields, getFields } from "../utils";
import { IPublicBlock } from "./types";

const blockFields = getFields<IPublicBlock>({
    customId: true,
    createdBy: true,
    createdAt: true,
    type: true,
    name: true,
    description: true,
    dueAt: true,
    color: true,
    updatedAt: true,
    updatedBy: true,
    parent: true,
    rootBlockId: true,
    assignees: {
        assignedAt: true,
        assignedBy: true,
        userId: true,
    },
    priority: true,
    subTasks: {
        createdAt: true,
        createdBy: true,
        customId: true,
        description: true,
        completedAt: true,
        completedBy: true,
        updatedAt: true,
        updatedBy: true,
    },
    boardStatuses: {
        createdAt: true,
        createdBy: true,
        customId: true,
        description: true,
        updatedAt: true,
        updatedBy: true,
        color: true,
        name: true,
    },
    boardLabels: {
        createdAt: true,
        createdBy: true,
        customId: true,
        description: true,
        updatedAt: true,
        updatedBy: true,
        color: true,
        name: true,
    },
    boardResolutions: {
        createdAt: true,
        createdBy: true,
        customId: true,
        description: true,
        updatedAt: true,
        updatedBy: true,
        name: true,
    },
    status: true,
    statusAssignedBy: true,
    statusAssignedAt: true,
    taskResolution: true,
    labels: {
        assignedAt: true,
        assignedBy: true,
        customId: true,
    },
    currentSprintId: true,
    taskSprint: {
        assignedAt: true,
        assignedBy: true,
        sprintId: true,
    },
    sprintOptions: {
        createdAt: true,
        createdBy: true,
        duration: true,
        updatedAt: true,
        updatedBy: true,
    },
    lastSprintId: true,
    nextSprintIndex: true,
});

export function getPublicBlockDataExt(block: Partial<IBlock>): IPublicBlock {
    return extractFields(block, blockFields);
}

export function toPublicBlockData(block: IBlock): IPublicBlock {
    return {
        customId: block.customId,
        createdBy: block.createdBy,
        createdAt: block.createdAt,
        type: block.type,
        name: block.name,
        description: block.description,
        dueAt: block.dueAt,
        color: block.color,
        updatedAt: block.updatedAt,
        updatedBy: block.updatedBy,
        parent: block.parent,
        rootBlockId: block.rootBlockId,
        priority: block.priority,
        status: block.status,
        statusAssignedBy: block.statusAssignedBy,
        statusAssignedAt: block.statusAssignedAt,
        currentSprintId: block.currentSprintId,
        taskResolution: block.taskResolution,
        taskSprint: {
            assignedAt: block.taskSprint.assignedAt,
            assignedBy: block.taskSprint.assignedBy,
            sprintId: block.taskSprint.sprintId,
        },
        assignees: block.assignees.map((assignee) => ({
            assignedAt: assignee.assignedAt,
            assignedBy: assignee.assignedBy,
            userId: assignee.userId,
        })),
        sprintOptions: {
            createdAt: block.sprintOptions.createdAt,
            createdBy: block.sprintOptions.createdBy,
            duration: block.sprintOptions.duration,
            updatedAt: block.sprintOptions.updatedAt,
            updatedBy: block.sprintOptions.updatedBy,
        },
        boardResolutions: block.boardResolutions.map((resolution) => ({
            createdAt: resolution.createdAt,
            createdBy: resolution.createdBy,
            customId: resolution.customId,
            name: resolution.name,
            description: resolution.description,
            updatedAt: resolution.updatedAt,
            updatedBy: resolution.updatedBy,
        })),
        labels: block.labels.map((label) => ({
            customId: label.customId,
            assignedBy: label.assignedBy,
            assignedAt: label.assignedAt,
        })),
        boardLabels: block.boardLabels.map((label) => ({
            customId: label.customId,
            name: label.name,
            color: label.color,
            createdBy: label.createdBy,
            createdAt: label.createdAt,
            description: label.description,
            updatedBy: label.updatedBy,
            updatedAt: label.updatedAt,
        })),
        boardStatuses: block.boardStatuses.map((status) => ({
            customId: status.customId,
            name: status.name,
            color: status.color,
            description: status.description,
            createdBy: status.createdBy,
            createdAt: status.createdAt,
            updatedBy: status.updatedBy,
            updatedAt: status.updatedAt,
        })),
        subTasks: block.subTasks.map((subTask) => ({
            customId: subTask.customId,
            description: subTask.description,
            createdAt: subTask.createdAt,
            createdBy: subTask.createdBy,
            updatedAt: subTask.updatedAt,
            updatedBy: subTask.updatedBy,
            completedBy: subTask.completedBy,
            completedAt: subTask.completedAt,
        })),
    };
}

export function getBlockRootBlockId(block: IBlock) {
    return block.rootBlockId || block.customId;
}

export function getBlockTypeName(blockType: BlockType) {
    switch (blockType) {
        case "org":
            return "Org";

        case "task":
            return "Task";

        case "board":
            return "Board";

        case "root":
        default:
            return "Block";
    }
}
