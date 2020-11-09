import {
    BlockType,
    IAssignee,
    IBlockAssignedLabel,
    IBlockLabel,
    IBlockStatus,
    IBoardStatusResolution,
    ISubTask,
    ITaskSprint,
} from "../../mongo/block";
import { IBoardSprintOptions } from "../../mongo/sprint";
import { ConvertDatesToStrings } from "../../utilities/types";

export interface INewBlockInput {
    // TODO: should we generate customId on our side, and have maybe something like clientGivenId
    // with prefix c_id...?
    customId: string;
    type: BlockType;
    name: string;
    description?: string;
    dueAt?: string;
    color?: string;
    parent?: string;
    rootBlockId?: string;
    assignees?: IAssignee[];
    priority?: string;
    subTasks?: ISubTask[];
    boardStatuses?: IBlockStatus[];
    boardLabels?: IBlockLabel[];
    boardResolutions?: IBoardStatusResolution[];
    status?: string;
    statusAssignedBy?: string;
    statusAssignedAt?: string;
    taskResolution?: string;
    labels?: IBlockAssignedLabel[];
    taskSprint?: ITaskSprint;
}

export type IPublicBlock = ConvertDatesToStrings<{
    customId: string;
    createdBy: string;
    createdAt: string;
    type: BlockType;
    name: string;
    description?: string;
    dueAt?: string;
    color?: string;
    updatedAt?: string;
    updatedBy?: string;
    parent?: string;
    rootBlockId?: string;
    assignees?: IAssignee[];
    priority?: string;
    subTasks?: ISubTask[]; // should sub-tasks be their own blocks?
    boardStatuses?: IBlockStatus[];
    boardLabels?: IBlockLabel[];
    boardResolutions?: IBoardStatusResolution[];
    status?: string;
    statusAssignedBy?: string;
    statusAssignedAt?: string;
    taskResolution?: string;
    labels?: IBlockAssignedLabel[];
    currentSprintId?: string;
    taskSprint?: ITaskSprint;
    sprintOptions?: IBoardSprintOptions;
    lastSprintId?: string;
}>;
