import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import {
  IBlock,
  ISubTask,
  ITaskCollaborationData,
  ITaskCollaborator
} from "mongo/block";

export interface IUpdateBlockInput {
  name: string;
  description: string;
  expectedEndAt: number;
  color: string;
  priority: string;
  taskCollaborationData: ITaskCollaborationData;
  taskCollaborators: ITaskCollaborator[];
  parents: string[];
  groups: string[];
  projects: string[];
  tasks: string[];
  groupTaskContext: string[];
  groupProjectContext: string[];
  subTasks: ISubTask[];
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
}

export interface IUpdateBlockParameters {
  blockID: string;
  data: IUpdateBlockInput;
}

export interface IUpdateBlockContext extends IBaseEndpointContext {
  data: IUpdateBlockParameters;
  updateBlock: (
    blockID: string,
    data: IDirectUpdateBlockInput
  ) => Promise<void>;
  transferBlock: (block: IBlock, destinationBlockID: string) => Promise<void>;
}
