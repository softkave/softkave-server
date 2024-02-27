import {IResource} from '../../models/resource';
import {SystemResourceType} from '../../models/system';
import {ITask} from '../../mongo/block/task';
import {getDateString, getDateStringIfExists} from '../../utilities/fns';
import {getResourceTypeFromId} from '../../utilities/ids';
import {extractFields, getFields, publicWorkspaceResourceFields} from '../utils';
import {TaskDoesNotExistError} from './errors';
import {IPublicTask} from './types';

const taskFields = getFields<IPublicTask>({
  ...publicWorkspaceResourceFields,
  name: true,
  description: true,
  dueAt: true,
  boardId: true,
  assignees: {
    assignedAt: getDateString,
    assignedBy: true,
    userId: true,
  },
  priority: true,
  subTasks: {
    createdAt: getDateString,
    createdBy: true,
    customId: true,
    description: true,
    completedAt: getDateStringIfExists,
    completedBy: true,
    updatedAt: getDateStringIfExists,
    updatedBy: true,
  },
  status: true,
  statusAssignedBy: true,
  statusAssignedAt: getDateStringIfExists,
  taskResolution: true,
  labels: {
    assignedAt: getDateString,
    assignedBy: true,
    labelId: true,
  },
  taskSprint: {
    assignedAt: getDateString,
    assignedBy: true,
    sprintId: true,
  },
});

export function getPublicTaskData(block: Partial<ITask>): IPublicTask {
  return extractFields(block, taskFields);
}

export function getPublicTasksArray(blocks: Array<Partial<ITask>>): IPublicTask[] {
  return blocks.map(block => extractFields(block, taskFields));
}

export function throwTaskNotFoundError() {
  throw new TaskDoesNotExistError();
}

export function assertTask(task?: ITask | null): asserts task {
  if (!task) {
    throwTaskNotFoundError();
  }
}

export function isTask(resource: IResource): resource is ITask {
  return getResourceTypeFromId(resource.customId) === SystemResourceType.Task;
}
