import { BlockType, IBlock } from "../../mongo/block";
import { IPublicBlock } from "./types";

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
    assignees: block.assignees.map((assignee) => ({
      assignedAt: assignee.assignedAt,
      assignedBy: assignee.assignedBy,
      userId: assignee.userId,
    })),
    priority: block.priority,
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
    status: block.status,
    statusAssignedBy: block.statusAssignedBy,
    statusAssignedAt: block.statusAssignedAt,
    labels: block.labels.map((label) => ({
      customId: label.customId,
      assignedBy: label.assignedBy,
      assignedAt: label.assignedAt,
    })),
  };
}

export function getBlockRootBlockId(block: IBlock) {
  return block.rootBlockId || block.customId;
}

export function getBlockTypeName(blockType?: BlockType) {
  switch (blockType) {
    case "org":
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
