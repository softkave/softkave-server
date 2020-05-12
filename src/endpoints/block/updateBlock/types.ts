import {
  BlockType,
  IBlock,
  IBlockLabel,
  IBlockStatus,
  ISubTask,
  ITaskCollaborationData,
  ITaskCollaborator,
} from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { IBaseEndpointContext } from "../../BaseEndpointContext";

export interface IUpdateBlockInput {
  name: string;
  description: string;
  expectedEndAt: number;
  color: string;
  priority: string;
  taskCollaborationData: ITaskCollaborationData;
  taskCollaborators: ITaskCollaborator[];
  type: BlockType;
  parent: string;
  groups: string[];
  projects: string[];
  tasks: string[];
  groupTaskContext: string[];
  groupProjectContext: string[];
  subTasks: ISubTask[];
  availableStatus: IBlockStatus[];
  availableLabels: IBlockLabel[];
  status: string;
  labels: string[];
}

export interface IDirectUpdateBlockInput {
  name: string;
  description: string;
  expectedEndAt: number;
  color: string;
  priority: string;
  taskCollaborationData: ITaskCollaborationData;
  taskCollaborators: ITaskCollaborator[];
  groups: string[];
  projects: string[];
  tasks: string[];
  subTasks: ISubTask[];
  groupTaskContext: string[];
  groupProjectContext: string[];
  availableStatus: IBlockStatus[];
  availableLabels: IBlockLabel[];
  status: string;
  labels: string[];
}

export interface ITaskAssigneesDiff {
  newAssignees: ITaskCollaborator[];
  removedAssignees: ITaskCollaborator[];
}

export interface IUpdateBlockParameters {
  customId: string;
  data: IUpdateBlockInput;
}

export interface IUpdateBlockContext extends IBaseEndpointContext {
  data: IUpdateBlockParameters;
  transferBlock: (
    block: IBlock,
    sourceBlockID: string,
    destinationBlockID: string
  ) => Promise<void>;
  sendAssignedTaskEmailNotification: (
    org: IBlock,
    taskDescription: string,
    assigner: IUser,
    assignee: IUser
  ) => Promise<void>;
}
