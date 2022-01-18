import { IAssignee, IBlock } from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint, IUpdateComplexTypeArrayInput } from "../../types";
import { TransferBlockEndpoint } from "../transferBlock/types";
import {
    IAssigneeInput,
    IBlockAssignedLabelInput,
    IBlockLabelInput,
    IBlockStatusInput,
    IBoardStatusResolutionInput,
    IPublicBlock,
    ISubTaskInput,
    ITaskSprintInput,
} from "../types";

export interface IUpdateBlockInput {
    name?: string;
    description?: string;
    color?: string;
    priority?: string;
    parent?: string;
    subTasks?: IUpdateComplexTypeArrayInput<ISubTaskInput>;
    dueAt?: string;
    assignees?: IUpdateComplexTypeArrayInput<IAssigneeInput>;
    boardStatuses?: IUpdateComplexTypeArrayInput<IBlockStatusInput>;
    boardLabels?: IUpdateComplexTypeArrayInput<IBlockLabelInput>;
    boardResolutions?: IUpdateComplexTypeArrayInput<IBoardStatusResolutionInput>;
    status?: string;
    taskResolution?: string;
    labels?: IUpdateComplexTypeArrayInput<IBlockAssignedLabelInput>;
    taskSprint?: ITaskSprintInput;
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

export type UpdateBlockEndpoint = Endpoint<
    IUpdateBlockContext,
    IUpdateBlockParameters,
    { block: IPublicBlock }
>;
