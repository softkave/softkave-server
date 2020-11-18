import moment from "moment";
import { BlockType, IAssignee, IBlock, ISubTask } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import cast, { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import {
    ExtractFieldsDefaultScalarTypes,
    IUpdateComplexTypeArrayInput,
} from "../../types";
import {
    extractFields,
    getFields,
    getUpdateComplexTypeArrayInput,
} from "../../utils";
import { ITaskSprintInput } from "../types";
import { IUpdateBlockInput } from "./types";

interface IUpdateBlockExtractFieldsExtraArgs {
    user: IUser;
    block: IBlock;
}

function processStatuses<T1, T2>(
    field: "boardStatuses" | "boardLabels" | "boardResolutions",
    data: IUpdateComplexTypeArrayInput<T1>,
    args: IUpdateBlockExtractFieldsExtraArgs
) {
    const statuses: T2[] = cast<T2[]>(args.block[field] || []);
    const { add, updateMap, removeMap } = getUpdateComplexTypeArrayInput(data);

    return (
        statuses
            // possible bug hiding spot
            // @ts-ignore
            .filter((status) => !removeMap[status.customId])
            .map((status) => {
                // possible bug hiding spot
                // @ts-ignore
                const incomingUpdate = updateMap[status.customId];

                if (!incomingUpdate) {
                    return status;
                }

                const updatedStatus = {
                    ...status,
                    updatedAt: getDate(),
                    updatedBy: args.user.customId,
                };

                return updatedStatus;
            })
            .concat(
                add.map((status) => {
                    // possible bug hiding spot
                    // @ts-ignore
                    const newStatus: T2 = {
                        ...status,
                        createdAt: getDate(),
                        createdBy: args.user.customId,
                        customId: getNewId(),
                    };

                    return newStatus;
                })
            )
    );
}

function processAssignees<T1, T2>(
    field: "assignees" | "labels",
    idField: "customId" | "userId",
    data: IUpdateComplexTypeArrayInput<T1>,
    args: IUpdateBlockExtractFieldsExtraArgs
) {
    // possible bug hiding spot
    // @ts-ignore
    const assignees: T2[] = args.block[field] || [];
    const { add, removeMap } = getUpdateComplexTypeArrayInput(data);

    return assignees
        .filter((assignee) => !removeMap[assignee[idField]])
        .concat(
            // possible bug hiding spot
            // @ts-ignore
            add.map((assignee) => {
                // possible bug hiding spot
                // @ts-ignore
                const newAssignee: IAssignee = {
                    ...assignee,
                    assignedAt: getDate(),
                    assignedBy: args.user.customId,
                };

                return newAssignee;
            })
        );
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
        const { add, updateMap, removeMap } = getUpdateComplexTypeArrayInput(
            data
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

                if (incomingUpdate.data.completedBy) {
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
    assignees: (...args) => processAssignees("assignees", "userId", ...args),
    boardStatuses: (...args) => processStatuses("boardStatuses", ...args),
    boardLabels: (...args) => processStatuses("boardLabels", ...args),
    boardResolutions: (...args) => processStatuses("boardResolutions", ...args),
    status: true,
    taskResolution: true,
    labels: (...args) => processAssignees("labels", "customId", ...args),
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
