import moment from "moment";
import { BlockType, IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { getDate } from "../../../utilities/fns";
import { IInternalAddBlockNewBlockInput } from "./types";

export default function manualProcessInternalAddBlockInput(
    inputBlock: IInternalAddBlockNewBlockInput,
    user: IUser
) {
    const now = getDate();

    const block: Omit<IBlock, "customId"> = {
        name: inputBlock.name,
        lowerCasedName:
            inputBlock.name && inputBlock.type !== BlockType.Task
                ? inputBlock.name.toLowerCase()
                : undefined,
        description: inputBlock.description,
        dueAt: inputBlock.dueAt
            ? getDate(moment().add(inputBlock.dueAt, "milliseconds").valueOf())
            : undefined,
        createdAt: now,
        color: inputBlock.color,
        updatedAt: undefined,
        type: inputBlock.type,
        parent: inputBlock.parent,
        rootBlockId: inputBlock.rootBlockId,
        createdBy: user.customId,
        assignees: (inputBlock.assignees || []).map((assignee) => ({
            ...assignee,
            assignedAt: now,
            assignedBy: user.customId,
        })),
        priority: inputBlock.priority,
        subTasks: (inputBlock.subTasks || []).map((subTask) => ({
            ...subTask,
            createdAt: now,
            createdBy: user.customId,
        })),
        boardLabels: (inputBlock.boardLabels || []).map((status) => ({
            ...status,
            createdAt: now,
            createdBy: user.customId,
        })),
        boardStatuses: (inputBlock.boardStatuses || []).map((status) => ({
            ...status,
            createdAt: now,
            createdBy: user.customId,
        })),
        boardResolutions: (inputBlock.boardResolutions || []).map((status) => ({
            ...status,
            createdAt: now,
            createdBy: user.customId,
        })),
        labels: (inputBlock.labels || []).map((assignedLabel) => ({
            ...assignedLabel,
            assignedAt: now,
            assignedBy: user.customId,
        })),
        status: inputBlock.status,
        statusAssignedBy:
            inputBlock.statusAssignedBy || inputBlock.status
                ? user.customId
                : undefined,
        statusAssignedAt: inputBlock.status ? now : undefined,
        taskResolution: inputBlock.taskResolution,
        taskSprint: inputBlock.taskSprint
            ? {
                  ...inputBlock.taskSprint,
                  assignedAt: now,
                  assignedBy: user.customId,
              }
            : undefined,
    };

    return block;
}
