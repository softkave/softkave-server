import {
    BlockType,
    IAssignee,
    IBlockAssignedLabel,
    IBlockLabel,
    IBlockStatus,
    IBoardStatusResolution,
    ISubTask,
} from "../../mongo/block";

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
}

export interface IPublicBlock {
    customId: string;
    createdBy: string;
    createdAt: Date;
    type: BlockType;
    name: string;
    description?: string;
    dueAt?: Date;
    color?: string;
    updatedAt?: Date;
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
    statusAssignedAt?: Date;
    taskResolution?: string;
    labels?: IBlockAssignedLabel[];
}
