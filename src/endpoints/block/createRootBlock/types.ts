import { IBaseEndpointContext } from "endpoints/BaseEndpointContext";
import {
  IBlock,
  ISubTask,
  ITaskCollaborationData,
  ITaskCollaborator
} from "mongo/block";

export interface INewBlockInput {
  name: string;
  customId: string;
  description: string;
  expectedEndAt: number;
  color: string;
  type: string;

  // TODO: should we only leave the first parent and find another way to implement the parent list?
  parents: string[];
  priority: string;

  // TODO: should we remove isBacklog?
  // isBacklog: boolean;
  taskCollaborationData: ITaskCollaborationData;
  taskCollaborators: ITaskCollaborator[];
  // linkedBlocks: ILinkedBlock[];
  subTasks?: ISubTask[];

  // TODO: should we leave these here or implement them another way?
  groups?: string[];
  projects?: string[];
  tasks?: string[];

  // TODO: should we get rid of these too?
  // groupTaskContext?: string[];
  // groupProjectContext?: string[];
}

export interface IAddBlockParameters {
  block: INewBlockInput;
}

export interface IAddBlockContext extends IBaseEndpointContext {
  data: IAddBlockParameters;
}

export interface IAddBlockResult {
  block: IBlock;
}
