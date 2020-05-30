import {
  BlockType,
  IBlockAssignedLabel,
  IBlockLabel,
  IBlockStatus,
  ISubTask,
  ITaskCollaborator,
} from "../../mongo/block";

export interface INewBlockInput {
  // TODO: should we generate customId on our side, and have maybe something like clientGivenId
  // with prefix c_id...?
  customId: string;
  type: BlockType;
  name?: string;
  description?: string;
  dueAt?: string;
  color?: string;
  parent?: string;
  rootBlockId?: string;
  assignees?: ITaskCollaborator[];
  priority?: string;
  subTasks?: ISubTask[];
  boardStatuses?: IBlockStatus[];
  boardLabels?: IBlockLabel[];
  status?: string;
  statusAssignedBy?: string;
  statusAssignedAt?: string;
  labels?: IBlockAssignedLabel[];
}
