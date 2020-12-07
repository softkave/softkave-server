import moment from "moment";
import { BlockType, IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { getDate } from "../../../utilities/fns";
import { ExtractFieldsDefaultScalarTypes } from "../../types";
import { extractFields, getFields } from "../../utils";
import { IInternalAddBlockNewBlockInput } from "./types";

interface IInternalAddBlockExtractFieldsExtraArgs {
    user: IUser;
}

const fields = getFields<
    IInternalAddBlockNewBlockInput,
    ExtractFieldsDefaultScalarTypes | object | any[],
    IInternalAddBlockExtractFieldsExtraArgs,
    { [key in keyof IInternalAddBlockNewBlockInput]: IBlock[key] }
>({
    type: true,
    name: true,
    description: true,
    dueAt: (data) => {
        return getDate(data);
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
        }));
    },
    boardStatuses: (data, args) => {
        return data.map((status) => ({
            ...status,
            createdAt: getDate(),
            createdBy: args.user.customId,
        }));
    },
    boardLabels: (data, args) => {
        return data.map((label) => ({
            ...label,
            createdAt: getDate(),
            createdBy: args.user.customId,
        }));
    },
    boardResolutions: (data, args) => {
        return data.map((resolution) => ({
            ...resolution,
            createdAt: getDate(),
            createdBy: args.user.customId,
        }));
    },
    status: true,
    statusAssignedBy: true,
    taskResolution: true,
    labels: (data, args) => {
        return data.map((assignedLabel) => ({
            ...assignedLabel,
            assignedAt: getDate(),
            assignedBy: args.user.customId,
        }));
    },
    taskSprint: (data, args) => {
        return {
            ...data,
            assignedAt: getDate(),
            assignedBy: args.user.customId,
        };
    },
    permissionResourceId: true,
});

export default function processInternalAddBlockInput(
    data: IInternalAddBlockNewBlockInput,
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
