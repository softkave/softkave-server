import moment from "moment";
import { BlockType, IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { ExtractFieldsDefaultScalarTypes } from "../../types";
import { extractFields, getFields } from "../../utils";
import { INewBlockInput } from "../types";

interface IInternalAddBlockExtractFieldsExtraArgs {
    user: IUser;
}

type P<T1, T2> = {
    [key in keyof T1]: key extends keyof T2 ? T1[key] : never;
} &
    {
        [key in keyof T2]: key extends keyof T1 ? T1[key] : never;
    };

const fields = getFields<
    INewBlockInput,
    ExtractFieldsDefaultScalarTypes | object | any[],
    IInternalAddBlockExtractFieldsExtraArgs,
    { [key in keyof INewBlockInput]: IBlock[key] }
>({
    type: true,
    name: true,
    description: true,
    dueAt: (data) => {
        return getDate(moment().add(data, "milliseconds").valueOf());
    },
    color: true,
    parent: true,
    rootBlockId: true,
    assignees: (data, args) => {
        return data.map((assignee) => ({
            ...assignee,
            assignedAt: getDate(),
            assignedBy: args.user.customId,
        }));
    },
    priority: true,
    subTasks: (data, args) => {
        return data.map((subTask) => ({
            ...subTask,
            createdAt: getDate(),
            createdBy: args.user.customId,
            customId: getNewId(),
        }));
    },
    boardStatuses: (data, args) => {
        return data.map((status) => ({
            ...status,
            createdAt: getDate(),
            createdBy: args.user.customId,
            customId: getNewId(),
        }));
    },
    boardLabels: (data, args) => {
        return data.map((label) => ({
            ...label,
            createdAt: getDate(),
            createdBy: args.user.customId,
            customId: getNewId(),
        }));
    },
    boardResolutions: (data, args) => {
        return data.map((resolution) => ({
            ...resolution,
            createdAt: getDate(),
            createdBy: args.user.customId,
            customId: getNewId(),
        }));
    },
    status: true,
    taskResolution: true,
    labels: (data, args) => {
        return data.map((assignedLabel) => ({
            ...assignedLabel,
            assignedAt: getDate(),
            assignedBy: args.user.customId,
            customId: getNewId(),
        }));
    },
    taskSprint: (data, args) => {
        return {
            ...data,
            assignedAt: getDate(),
            assignedBy: args.user.customId,
        };
    },
});

export default function processInternalAddBlockInput(
    data: INewBlockInput,
    user: IUser
): Omit<IBlock, "customId"> {
    const update = extractFields(data, fields, {
        user,
    });

    const block: Omit<IBlock, "customId"> = {
        ...update,
        createdAt: getDate(),
        createdBy: user.customId,
    };

    if (block.name && block.type !== BlockType.Task) {
        block.lowerCasedName = block.name.toLowerCase();
    }

    if (block.status) {
        block.statusAssignedBy = user.customId;
        block.statusAssignedAt = getDate();
    }

    block.createdAt = getDate();
    block.createdBy = user.customId;

    return block;
}
