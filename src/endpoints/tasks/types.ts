import {ResourceVisibility} from '../../models/resource';
import {ITask} from '../../mongo/block/task';
import {ConvertDatesToStrings} from '../../utilities/types';
import {IResourceWithId} from '../types';

export interface IAssigneeInput {
  userId: string;
}

export interface ISubTaskInput extends IResourceWithId {
  description: string;
  completedBy?: string;
}

export interface ITaskAssignedLabelInput {
  labelId: string;
}

export interface ITaskSprintInput {
  sprintId: string;
}

export interface INewTaskInput {
  name: string;
  description?: string;
  dueAt?: string;
  boardId: string;
  workspaceId: string;
  assignees: IAssigneeInput[];
  priority: string;
  subTasks: ISubTaskInput[];
  status?: string;
  taskResolution?: string;
  labels: ITaskAssignedLabelInput[];
  taskSprint?: ITaskSprintInput;
  visibility?: ResourceVisibility;
}

export type IPublicTask = ConvertDatesToStrings<ITask>;
