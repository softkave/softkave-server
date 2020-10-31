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
});

export function getPublicBlockDataExt(block: Partial<IBlock>): IPublicBlock {
    return extractFields(block, blockFields);
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
