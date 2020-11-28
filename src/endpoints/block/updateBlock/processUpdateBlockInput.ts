import moment from "moment";
import { BlockType, IBlock, ISubTask } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { IdExistsError } from "../../../utilities/errors";
import { getDate, indexArray } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import OperationError from "../../../utilities/OperationError";
import {
    ExtractFieldsDefaultScalarTypes,
    IUpdateComplexTypeArrayInput,
} from "../../types";
import {
    extractFields,
    getComplexTypeArrayInput,
    getFields,
} from "../../utils";
import { IBlockStatusInput, ITaskSprintInput } from "../types";
import { IUpdateBlockInput } from "./types";

interface IUpdateBlockExtractFieldsExtraArgs {
    user: IUser;
    block: IBlock;
}

const fields = getFields<
    IUpdateBlockInput,
    | ExtractFieldsDefaultScalarTypes
    | IUpdateComplexTypeArrayInput<any>
    | ITaskSprintInput,
    IUpdateBlockExtractFieldsExtraArgs,
    Partial<IBlock>
>({
    name: true,
    description: true,
    color: true,
    priority: true,
    parent: true,
    subTasks: (data, args) => {
        const subTasks = args.block.subTasks || [];
        const { add, updateMap, removeMap } = getComplexTypeArrayInput(
            data,
            "customId"
        );

        return subTasks
            .filter((subTask) => !removeMap[subTask.customId])
            .map((subTask) => {
                const incomingUpdate = updateMap[subTask.customId];

                if (!incomingUpdate) {
                    return subTask;
                }

                const updatedSubTask = {
                    ...subTask,
                    ...incomingUpdate,
                    updatedAt: getDate(),
                    updatedBy: args.user.customId,
                };

                if (incomingUpdate.completedBy) {
                    updatedSubTask.completedAt = getDate();
                    updatedSubTask.completedBy = args.user.customId;
                }

                return updatedSubTask;
            })
            .concat(
                add.map((subTask) => {
                    const newSubTask: ISubTask = {
                        description: subTask.description,
                        createdAt: getDate(),
                        createdBy: args.user.customId,
                        customId: getNewId(),
                    };

                    if (subTask.completedBy) {
                        newSubTask.completedAt = getDate();
                        newSubTask.completedBy = args.user.customId;
                    }

                    return newSubTask;
                })
            );
    },
    dueAt: (data) => {
        return getDate(moment().add(data, "milliseconds").valueOf());
    },
    assignees: (data, args) => {
        const assignees = args.block.assignees || [];
        const { add, removeMap } = getComplexTypeArrayInput(data, "userId");

        return assignees
            .filter((assignee) => !removeMap[assignee.userId])
            .concat(
                add.map((assignee) => {
                    const newAssignee = {
                        ...assignee,
                        assignedAt: getDate(),
                        assignedBy: args.user.customId,
                    };

                    return newAssignee;
                })
            );
    },
    boardStatuses: (
        data: IUpdateComplexTypeArrayInput<IBlockStatusInput>,
        args: IUpdateBlockExtractFieldsExtraArgs
    ) => {
        const statuses = args.block.boardStatuses || [];
        const { add, update, updateMap, removeMap } = getComplexTypeArrayInput(
            data,
            "customId"
        );

        const updatedStatuses = statuses
            .filter((status) => !removeMap[status.customId])
            .map((status) => {
                const incomingUpdate = updateMap[status.customId];

                if (!incomingUpdate) {
                    return status;
                }

                const updatedStatus = {
                    ...status,
                    ...incomingUpdate,
                    updatedAt: getDate(),
                    updatedBy: args.user.customId,
                };

                return updatedStatus;
            });

        add.forEach((statusInput) => {
            const status = {
                ...statusInput,
                createdAt: getDate(),
                createdBy: args.user.customId,
            };

            updatedStatuses.splice(statusInput.position, 0, status);
        });

        const statusPosMap = indexArray(updatedStatuses, {
            path: "customId",
            reducer: (u1, u2, i) => i,
        });

        update.forEach((statusInput) => {
            const currentPos = statusPosMap[statusInput.customId];

            if (currentPos !== statusInput.position) {
                const status = updatedStatuses.splice(currentPos, 1);
                updatedStatuses.splice(statusInput.position, 0, status[0]);
            }
        });

        return updatedStatuses;
    },
    boardLabels: (
        data: IUpdateComplexTypeArrayInput<IBlockStatusInput>,
        args: IUpdateBlockExtractFieldsExtraArgs
    ) => {
        const labels = args.block.boardLabels || [];
        const { add, updateMap, removeMap } = getComplexTypeArrayInput(
            data,
            "customId"
        );

        const updatedLabels = labels
            .filter((label) => !removeMap[label.customId])
            .map((label) => {
                const incomingUpdate = updateMap[label.customId];

                if (!incomingUpdate) {
                    return label;
                }

                const updatedLabel = {
                    ...label,
                    ...incomingUpdate,
                    updatedAt: getDate(),
                    updatedBy: args.user.customId,
                };

                return updatedLabel;
            });

        add.forEach((labelInput) => {
            const label = {
                ...labelInput,
                createdAt: getDate(),
                createdBy: args.user.customId,
            };

            updatedLabels.push(label);
        });

        return updatedLabels;
    },
    boardResolutions: (
        data: IUpdateComplexTypeArrayInput<IBlockStatusInput>,
        args: IUpdateBlockExtractFieldsExtraArgs
    ) => {
        const resolutions = args.block.boardResolutions || [];
        const { add, updateMap, removeMap } = getComplexTypeArrayInput(
            data,
            "customId"
        );

        const updatedResolutions = resolutions
            .filter((resolution) => !removeMap[resolution.customId])
            .map((resolution) => {
                const incomingUpdate = updateMap[resolution.customId];

                if (!incomingUpdate) {
                    return resolution;
                }

                const updatedResolution = {
                    ...resolution,
                    ...incomingUpdate,
                    updatedAt: getDate(),
                    updatedBy: args.user.customId,
                };

                return updatedResolution;
            });

        add.forEach((resolutionInput) => {
            const resolution = {
                ...resolutionInput,
                createdAt: getDate(),
                createdBy: args.user.customId,
            };

            updatedResolutions.push(resolution);
        });

        return updatedResolutions;
    },
    status: true,
    taskResolution: true,
    labels: (data, args) => {
        const labels = args.block.labels || [];
        const { add, removeMap } = getComplexTypeArrayInput(data, "customId");

        return labels
            .filter((label) => !removeMap[label.customId])
            .concat(
                add.map((label) => {
                    const newLabel = {
                        ...label,
                        assignedAt: getDate(),
                        assignedBy: args.user.customId,
                    };

                    return newLabel;
                })
            );
    },
    taskSprint: (data, args) => {
        return {
            sprintId: data.sprintId,
            assignedAt: getDate(),
            assignedBy: args.user.customId,
        };
    },
});

export default function processUpdateBlockInput(
    block: IBlock,
    data: IUpdateBlockInput,
    user: IUser
): Partial<IBlock> {
    const update = extractFields(data, fields, {
        block,
        user,
    });

    if (update.name && block.type !== BlockType.Task) {
        update.lowerCasedName = update.name.toLowerCase();
    }

    if (update.status && update.status !== block.status) {
        const assignees = update.assignees || block.assignees || [];

        if (assignees.length === 0) {
            assignees.push({
                userId: user.customId,
                assignedAt: getDate(),
                assignedBy: user.customId,
            });

            update.assignees = assignees;
        }
    }

    update.updatedBy = user.customId;
    update.updatedAt = getDate();

    return update;
}
