import {TaskPriority} from '../../mongo/block/task';

const taskConstants = {
  maxNameLength: 300,
  maxDescriptionLength: 1000,
  maxTaskCollaboratorsLength: 20,
  priorityValuesArray: [TaskPriority.High, TaskPriority.Low, TaskPriority.Medium],
  maxSubTasks: 50,
  maxAssignedLabels: 20,
};

export {taskConstants};
