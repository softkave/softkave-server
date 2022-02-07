import { IAssignee, IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint, IUpdateComplexTypeArrayInput } from "../../types";
import { TransferTaskEndpoint } from "../transferTask/types";
import {
    IAssigneeInput,
    IBlockAssignedLabelInput,
    IPublicTask,
    ISubTaskInput,
    ITaskSprintInput,
} from "../types";

export interface IUpdateTaskInput {
    name?: string;
    description?: string;
    priority?: string;
    parent?: string;
    subTasks?: IUpdateComplexTypeArrayInput<ISubTaskInput>;
    dueAt?: string;
    assignees?: IUpdateComplexTypeArrayInput<IAssigneeInput>;
    status?: string;
    taskResolution?: string;
    labels?: IUpdateComplexTypeArrayInput<IBlockAssignedLabelInput>;
    taskSprint?: ITaskSprintInput;
}

export interface ITaskAssigneesDiff {
    newAssignees: IAssignee[];
    removedAssignees: IAssignee[];
}

export interface IUpdateTaskParameters {
    taskId: string;
    data: IUpdateTaskInput;
}

export interface IUpdateTaskContext extends IBaseContext {
    transferTask: TransferTaskEndpoint;
    sendAssignedTaskEmailNotification: (
        ctx: IBaseContext,
        board: IBlock,
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

export type UpdateTaskEndpoint = Endpoint<
    IUpdateTaskContext,
    IUpdateTaskParameters,
    { task: IPublicTask }
>;
