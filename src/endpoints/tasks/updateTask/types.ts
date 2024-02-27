import {ResourceVisibility} from '../../../models/resource';
import {IBoard} from '../../../mongo/block/board';
import {ITaskAssignee} from '../../../mongo/block/task';
import {IUser} from '../../../mongo/user/definitions';
import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint, IUpdateComplexTypeArrayInput} from '../../types';
import {TransferTaskEndpoint} from '../transferTask/types';
import {
  IAssigneeInput,
  IPublicTask,
  ISubTaskInput,
  ITaskAssignedLabelInput,
  ITaskSprintInput,
} from '../types';

export interface IUpdateTaskInput {
  name?: string;
  description?: string;
  priority?: string;
  boardId?: string;
  subTasks?: IUpdateComplexTypeArrayInput<ISubTaskInput>;
  dueAt?: string | Date;
  assignees?: IUpdateComplexTypeArrayInput<IAssigneeInput>;
  status?: string;
  taskResolution?: string;
  labels?: IUpdateComplexTypeArrayInput<ITaskAssignedLabelInput>;
  taskSprint?: ITaskSprintInput;
  visibility?: ResourceVisibility;
}

export interface ITaskAssigneesDiff {
  newAssignees: ITaskAssignee[];
  removedAssignees: ITaskAssignee[];
}

export interface IUpdateTaskParameters {
  taskId: string;
  data: IUpdateTaskInput;
}

export interface IUpdateTaskContext extends IBaseContext {
  transferTask: TransferTaskEndpoint;
  sendAssignedTaskEmailNotification: (
    ctx: IBaseContext,
    board: IBoard,
    taskName: string,
    taskDescription: string,
    assigner: IUser,
    assignee: IUser
  ) => Promise<any>;
}

export interface IUpdateTaskEndpointResult {
  task: IPublicTask;
}

export type UpdateTaskEndpoint = Endpoint<
  IUpdateTaskContext,
  IUpdateTaskParameters,
  IUpdateTaskEndpointResult
>;
