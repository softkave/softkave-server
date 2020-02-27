import {
  BlockType,
  ISubTask,
  ITaskCollaborationData,
  ITaskCollaborator
} from "../../mongo/block";

export interface INewBlockInput {
  name: string;

  // TODO: should we generate customId on our side, and have maybe something like clientGivenId
  // with prefix c_id...?
  customId: string;
  description?: string;
  expectedEndAt?: number;
  color: string;
  type: BlockType;

  // TODO: should we only leave the first parent and find another way to implement the parent list?
  parent?: string;
  rootBlockID?: string;
  priority?: string;
  taskCollaborationData?: ITaskCollaborationData;
  taskCollaborators?: ITaskCollaborator[];
  subTasks?: ISubTask[];

  // TODO: should we leave these here or implement them another way?
  groups?: string[];
  projects?: string[];
  tasks?: string[];

  // TODO: should we get rid of these too?
  groupTaskContext?: string[];
  groupProjectContext?: string[];
}
