import * as Joi from 'joi';
import {validationSchemas} from '../../../utilities/validationUtils';
import {endpointValidationSchemas} from '../../validation';
import {INewTaskInput} from '../types';
import taskValidationSchemas from '../validation';

export const newTaskJoiSchema = Joi.object<INewTaskInput>().keys({
  name: taskValidationSchemas.name.required(),
  description: taskValidationSchemas.description.optional().allow(null),
  dueAt: taskValidationSchemas.dueAt.optional().allow(null),
  boardId: validationSchemas.resourceId.required(),
  workspaceId: validationSchemas.resourceId.required(),
  priority: taskValidationSchemas.priority.required(),
  taskSprint: taskValidationSchemas.taskSprint.optional().allow(null),
  subTasks: taskValidationSchemas.subTasks.required(),
  status: validationSchemas.resourceId.allow(null),
  assignees: taskValidationSchemas.taskAssigneeList.required(),
  taskResolution: validationSchemas.resourceId.allow(null),
  labels: taskValidationSchemas.blockAssignedLabelsList.required(),
  visibility: endpointValidationSchemas.visibility,
});

export const createTaskJoiSchema = Joi.object()
  .keys({task: newTaskJoiSchema.required()})
  .required();
