import {
  BlockType,
  IBlock,
  ISubTask,
  ITaskCollaborationData,
  ITaskCollaborator
} from "../../../mongo/block";
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
}
