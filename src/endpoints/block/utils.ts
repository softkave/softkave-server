import { BlockType, IBlock } from "../../mongo/block";
import {
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from "../../mongo/collaboration-request";
import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { IPublicBlock } from "./types";

const blockFields = getFields<IPublicBlock>({
    customId: true,
    createdBy: true,
    createdAt: getDateString,
    type: true,
    name: true,
    description: true,
    dueAt: true,
    color: true,
    updatedAt: getDateString,
    updatedBy: true,
    parent: true,
    rootBlockId: true,
    assignees: {
        assignedAt: getDateString,
        assignedBy: true,
        userId: true,
    },
    priority: true,
    subTasks: {
        createdAt: getDateString,
        createdBy: true,
        customId: true,
        description: true,
        completedAt: getDateString,
        completedBy: true,
        updatedAt: getDateString,
        updatedBy: true,
    },
    boardStatuses: {
        createdAt: getDateString,
        createdBy: true,
        customId: true,
        description: true,
        updatedAt: getDateString,
        updatedBy: true,
        color: true,
        name: true,
        position: true,
    },
    boardLabels: {
        createdAt: getDateString,
        createdBy: true,
        customId: true,
        description: true,
        updatedAt: getDateString,
        updatedBy: true,
        color: true,
        name: true,
    },
    boardResolutions: {
        createdAt: getDateString,
        createdBy: true,
        customId: true,
        description: true,
        updatedAt: getDateString,
        updatedBy: true,
        name: true,
    },
    status: true,
    statusAssignedBy: true,
    statusAssignedAt: getDateString,
    taskResolution: true,
    labels: {
        assignedAt: getDateString,
        assignedBy: true,
        customId: true,
    },
    currentSprintId: true,
    taskSprint: {
        assignedAt: getDateString,
        assignedBy: true,
        sprintId: true,
    },
    sprintOptions: {
        createdAt: getDateString,
        createdBy: true,
        duration: true,
        updatedAt: getDateString,
        updatedBy: true,
    },
    lastSprintId: true,
});

export function getPublicBlockData(block: Partial<IBlock>): IPublicBlock {
    return extractFields(block, blockFields);
}

export function getPublicBlocksArray(
    blocks: Array<Partial<IBlock>>
): IPublicBlock[] {
    return blocks.map((block) => extractFields(block, blockFields));
}

export function getBlockRootBlockId(block: {
    rootBlockId?: string;
    customId: string;
}) {
    return block.rootBlockId || block.customId;
}

export function getBlockTypeName(blockType: BlockType) {
    switch (blockType) {
        case "organization":
            return "Organization";

        case "task":
            return "Task";

        case "board":
            return "Board";

        case "root":
        default:
            return "Block";
    }
}

export function isRequestAccepted(request: ICollaborationRequest) {
    if (Array.isArray(request.statusHistory)) {
        return !!request.statusHistory.find((status) => {
            return status.status === CollaborationRequestStatusType.Accepted;
        });
    }

    return false;
}
