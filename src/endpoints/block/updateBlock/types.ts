import {
    IAssignee,
    IBlock,
    IBlockAssignedLabel,
    IBlockLabel,
    IBlockStatus,
    IBoardStatusResolution,
    ISubTask,
} from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { TransferBlockEndpoint } from "../transferBlock/types";

export interface IUpdateBlockInput {
    name?: string;
    description?: string;
    color?: string;
    priority?: string;
    parent?: string;
    subTasks?: ISubTask[];
    dueAt?: Date; // not really a date, it's a string
    assignees?: IAssignee[];
    boardStatuses?: IBlockStatus[];
    boardLabels?: IBlockLabel[];
    boardResolutions?: IBoardStatusResolution[];
    status?: string;
    statusAssignedBy?: string;
    statusAssignedAt?: Date; // not really a date, it's a string
    taskResolution?: string;
    labels?: IBlockAssignedLabel[];
}

export interface ITaskAssigneesDiff {
    newAssignees: IAssignee[];
    removedAssignees: IAssignee[];
}

export interface IUpdateBlockParameters {
    blockId: string;
    data: IUpdateBlockInput;
}

export interface IUpdateBlockContext extends IBaseContext {
    transferBlock: TransferBlockEndpoint;
    sendAssignedTaskEmailNotification: (
        org: IBlock,
        taskName: string,
        taskDescription: string,
        assigner: IUser,
        assignee: IUser
    ) => Promise<any>;
    bulkUpdateDeletedStatusInTasks: (
        ctx: IBaseContext,
        parentId: string,
        items: Array<{ oldId: string; newId: string }>,
        user: IUser
    ) => Promise<void>;
    bulkUpdateDeletedResolutionsInTasks: (
        ctx: IBaseContext,
        parentId: string,
        ids: string[]
    ) => Promise<void>;
    bulkRemoveDeletedLabelsInTasks: (
        ctx: IBaseContext,
        parentId: string,
        ids: string[]
    ) => Promise<void>;
}

export type UpdateBlockEndpoint = Endpoint<
    IUpdateBlockContext,
    IUpdateBlockParameters
>;
