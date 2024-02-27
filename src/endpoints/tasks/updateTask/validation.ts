import * as Joi from 'joi';
import {complexFieldJoiSchema, validationSchemas} from '../../../utilities/validationUtils';
import {endpointValidationSchemas} from '../../validation';
import {taskConstants} from '../constants';
import taskValidationSchemas from '../validation';
import {IUpdateTaskInput, IUpdateTaskParameters} from './types';

const taskInput = Joi.object<IUpdateTaskInput>().keys({
  name: taskValidationSchemas.name,
  description: taskValidationSchemas.description.optional().allow(null),
  priority: taskValidationSchemas.priority,
  assignees: complexFieldJoiSchema(
    taskValidationSchemas.taskAssignee,
    taskConstants.maxTaskCollaboratorsLength,
    'userId'
  ),
  boardId: validationSchemas.resourceId,
  subTasks: complexFieldJoiSchema(
    taskValidationSchemas.subTaskSchema,
    taskConstants.maxSubTasks,
    'customId'
  ),
  status: validationSchemas.resourceId.optional().allow(null),
  dueAt: taskValidationSchemas.dueAt.optional().allow(null),
  taskResolution: validationSchemas.resourceId.optional().allow(null),
  labels: complexFieldJoiSchema(
    taskValidationSchemas.blockAssignedLabel,
    taskConstants.maxAssignedLabels,
    'customId'
  ),
  taskSprint: taskValidationSchemas.taskSprint.optional().allow(null),
  visibility: endpointValidationSchemas.visibility,
});

export const updateTaskJoiSchema = Joi.object<IUpdateTaskParameters>().keys({
  data: taskInput.required(),
  taskId: validationSchemas.resourceId.required(),
});
