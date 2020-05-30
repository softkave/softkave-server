import {
  IBlock,
  IBlockAssignedLabel,
  IBlockLabel,
  IBlockStatus,
  ISubTask,
  ITaskCollaborator,
} from "../../../mongo/block";
import { IUser } from "../../../mongo/user";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { TransferBlockEndpoint } from "../transferBlock/types";

export interface IUpdateBlockInput {
  name?: string;
  description?: string;
  color?: string;
  priority?: string;
  parent?: string;
  subTasks?: ISubTask[];
  dueAt?: string;
  assignees?: ITaskCollaborator[];
  boardStatuses?: IBlockStatus[];
  boardLabels?: IBlockLabel[];
  status?: string;
  statusAssignedBy?: string;
  statusAssignedAt?: string;
  labels?: IBlockAssignedLabel[];
}

export interface ITaskAssigneesDiff {
  newAssignees: ITaskCollaborator[];
  removedAssignees: ITaskCollaborator[];
}

export interface IUpdateBlockParameters {
  customId: string;
  data: IUpdateBlockInput;
}

export interface IUpdateBlockContext extends IBaseContext {
  transferBlock: TransferBlockEndpoint;
  sendAssignedTaskEmailNotification: (
    org: IBlock,
    taskDescription: string,
    assigner: IUser,
    assignee: IUser
  ) => Promise<any>;
}

export type UpdateBlockEndpoint = Endpoint<
  IUpdateBlockContext,
  IUpdateBlockParameters
>;
