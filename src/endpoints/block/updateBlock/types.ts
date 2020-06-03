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
import { IBlockContextModels } from "../../contexts/BlockContext";
import { Endpoint } from "../../types";
import { TransferBlockEndpoint } from "../transferBlock/types";

export interface IUpdateBlockInput {
  name?: string;
  description?: string;
  color?: string;
  priority?: string;
  parent?: string;
  subTasks?: ISubTask[];
  dueAt?: Date; // not really a date, it's a string
  assignees?: ITaskCollaborator[];
  boardStatuses?: IBlockStatus[];
  boardLabels?: IBlockLabel[];
  status?: string;
  statusAssignedBy?: string;
  statusAssignedAt?: Date; // not really a date, it's a string
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
  bulkUpdateDeletedStatusInTasks: (
    models: IBlockContextModels,
    orgId: string,
    items: Array<{ oldId: string; newId: string }>
  ) => Promise<void>;
  bulkRemoveDeletedLabelsInTasks: (
    models: IBlockContextModels,
    orgId: string,
    ids: string[]
  ) => Promise<void>;
}

export type UpdateBlockEndpoint = Endpoint<
  IUpdateBlockContext,
  IUpdateBlockParameters
>;
